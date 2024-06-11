import { Context } from "hono";
import { z } from "zod";
import s3Service from "../s3Service";
import { PostRepository } from "../../repositories/postRepository";
import { GetOnePostResponse } from "../../interfaces/Post/GetOnePostResponse";
import { HTTPException } from "hono/http-exception";

export const update = async (
  validationData: { content: string | null; files: File[] | null },
  c: Context
): Promise<{ message: string | null } | { error: string | null }> => {
  const postId = parseInt(c.req.param("id"), 10);
  const payload = c.get("jwtPayload");
  const userId = payload.id;

  const { content, files } = validationData;

  const post: GetOnePostResponse = await PostRepository.getOnePost(
    userId,
    postId
  );

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
    throw new HTTPException(500, { message: "Error updating post" });
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
    throw new HTTPException(500, { message: "Error uploading files" });
  }
};
