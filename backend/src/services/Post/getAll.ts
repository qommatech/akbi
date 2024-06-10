import { Context } from "hono";
import { Post } from "@prisma/client";
import { PostRepository } from "../../repositories/postRepository";
import { GetAllPostsResponse } from "../../interfaces/Post/GetAllPostsResponse";

export const getAll = async (c: Context): Promise<GetAllPostsResponse[]> => {
  const payload = c.get("jwtPayload");
  const userId = payload.id;
  try {
    const posts: GetAllPostsResponse[] =
      await PostRepository.getAllPosts(userId);
    return posts;
  } catch (error) {
    console.log("Error fetching posts: ", error);
    throw new Error("Error fetching posts");
  }
};
