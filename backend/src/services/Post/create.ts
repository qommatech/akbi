import { Context } from "hono";
import s3Service from "../s3Service";
import { z } from "zod";
import { PostRepository } from "../../repositories/postRepository";

export const create = async (
  c: Context
): Promise<{ message: string | null } | { error: string | null }> => {
  const formData = await c.req.formData();

  const data = {
    content: formData.get("content"),
    files: formData.getAll("files"),
  };
  // console.log(data);
  const validation = uploadPostSchema.safeParse(data);

  if (!validation.success) {
    const flattenedErrors = validation.error.flatten();
    const errorMessage = Object.values(flattenedErrors.fieldErrors)
      .flat()
      .join(", ");
    return { error: `Invalid input: ${errorMessage}` };
  }

  const { content, files } = validation.data;

  console.log({ content, files });

  const payload = c.get("jwtPayload");
  const userId = payload.id;

  try {
    const { id: postId } = await PostRepository.createPost(userId, content);

    const assetUrls: any[] = [];
    if (files) {
      const uploadPromises = Array.from(files).map(async (file) => {
        const uploadedAssetUrl = await uploadPost(file, postId);
        assetUrls.push(uploadedAssetUrl);
      });

      await Promise.all(uploadPromises);

      await PostRepository.createPostAsset(postId, assetUrls);
    }

    return { message: "Successfully created post" };
  } catch (error) {
    console.log("Error creating post", error);
    throw error;
  }
};

const uploadPost = async (file: File, postId: number) => {
  const isImage = file.type.startsWith("image/");
  const arrBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrBuffer);

  try {
    const type = isImage ? "Image" : "Video";
    const filename = `posts/${postId}/${Date.now()}${isImage ? ".png" : ".mp4"}`;
    const url = await s3Service.uploadFile(buffer, filename);
    return { url, type };
  } catch (error) {
    console.log("Error inserting post asset into S3 :", error);
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

const uploadPostSchema = z.object({
  content: z
    .string({
      message: "Invalid type specified",
    })
    .min(1),
  files: z
    .array(z.instanceof(File))
    .optional()
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
    ),
});
