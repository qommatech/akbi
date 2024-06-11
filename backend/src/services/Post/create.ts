import { Context } from "hono";
import s3Service from "../s3Service";
import { PostRepository } from "../../repositories/postRepository";
import { HTTPException } from "hono/http-exception";

export const create = async (
  validationData: { content: string; files: File[] | null },
  c: Context
): Promise<{ message: string | null }> => {
  const { content, files } = validationData;

  const payload = c.get("jwtPayload");
  const userId = payload.id;

  try {
    const { id: postId } = await PostRepository.createPost(userId, content);

    const assetUrls: any[] = [];
    if (files && files?.length > 0) {
      const uploadPromises = Array.from(files).map(async (file: File) => {
        const uploadedAssetUrl = await uploadPost(file, postId);
        assetUrls.push(uploadedAssetUrl);
      });

      await Promise.all(uploadPromises);

      await PostRepository.createPostAsset(postId, assetUrls);
    }

    return { message: "Successfully created post" };
  } catch (error) {
    console.log("Error creating post", error);
    throw new HTTPException(500, { message: "Error creating post" });
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
    throw new HTTPException(500, {
      message: "Error uploading post assets into S3",
    });
  }
};
