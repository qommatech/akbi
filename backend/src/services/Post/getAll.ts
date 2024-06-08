import { Context } from "hono";
import { Post } from "@prisma/client";
import { PostRepository } from "../../repositories/postRepository";

export const getAll = async (
  c: Context
): Promise<{ posts: Post[] } | { error: string }> => {
  const payload = c.get("jwtPayload");
  const userId = payload.id;
  try {
    const posts = await PostRepository.getAllPosts(userId);
    return posts;
  } catch (error) {
    console.log("Error fetching posts: ", error);
    return { error: "Error fetching posts" };
  }
};
