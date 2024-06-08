import { Context } from "hono";
import { z } from "zod";
import s3Service from "../s3Service";
import { PostRepository } from "../../repositories/postRepository";

export const update = async (
  c: Context
): Promise<
  { message: string | null } | { error: string | null } | undefined
> => {
  const postId = parseInt(c.req.param("id"), 10);
  const payload = c.get("jwtPayload");
  const userId = payload.id;

  const formData = await c.req.formData();

  const data = {
    content: formData.get("content"),
    files: formData.getAll("files") as File[],
  };
  // console.log(data);
  const validation = updatePostSchema.safeParse(data);

  if (!validation.success) {
    const flattenedErrors = validation.error.flatten();
    const errorMessage = Object.values(flattenedErrors.fieldErrors)
      .flat()
      .join(", ");
    return { error: `Invalid input: ${errorMessage}` };
  }

  const { content, files } = validation.data;

  const post = await PostRepository.getOnePost(userId, postId);

  if (post.author.id !== userId) {
    return { error: "Unauthorized" };
  }
  if (!post) {
    return { error: "No post found" };
  }

  try {
    if (files && files.length > 0) {
      const postAssets = post.postAsset;
      await s3Service.deleteFiles(postAssets);
      await PostRepository.deletePostAssets(postId);
      const s3Response = await uploadUpdatedPost(files, postId);
      await PostRepository.createPostAsset(postId, s3Response);
    }

    if (content) {
      await PostRepository.updatePost(postId, content);
    }

    return { message: "Successfully updated post" };
  } catch (error) {
    console.log("Error updating post:", error);
    return { error: "Failed to update post" };
  }
};

const uploadUpdatedPost = async (files: File[], postId: number) => {
  const uploadTasks = files.map(async (file) => {
    const isImage = file.type.startsWith("image/");
    const arrBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrBuffer);

    return {
      filePath: buffer,
      key: `posts/${postId}/${Date.now()}${isImage ? ".png" : ".mp4"}`,
      isVideo: !isImage,
      file,
    };
  });

  const filesToUpload = await Promise.all(uploadTasks);
  try {
    const uploadResults = await s3Service.uploadFiles(filesToUpload);
    return uploadResults;
  } catch (error) {
    console.log("Error uploading files:", error);
    throw error;
  }
};

const MAX_FILE_SIZE = 10000000;
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/ogg",
];

const updatePostSchema = z.object({
  content: z
    .string({
      message: "Invalid type specified",
    })
    .min(1)
    .nullable(),
  files: z
    .array(z.instanceof(File))
    .max(5, {
      message: "You can upload up to 5 files",
    })
    .refine(
      (files) =>
        !files ||
        files.every(
          (file) =>
            ACCEPTED_FILE_TYPES.includes(file.type) &&
            file.size <= MAX_FILE_SIZE
        ),
      {
        message: "Invalid file type or size specified",
      }
    )
    .nullable(),
});
