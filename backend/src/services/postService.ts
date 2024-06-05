import { Context } from "hono";
import { PostRepository } from "../repositories/postRepository";
import { Post } from "@prisma/client";
import { string, z } from "zod";

const uploadPostSchema = z.object({
  content: z.string().min(1),
});

export const postService = {
  index: async (c: Context): Promise<{ posts: Post[] } | { error: string }> => {
    const payload = c.get("jwtPayload");
    const userId = payload.id;
    try {
      const posts = await PostRepository.getAllPosts(userId);
      return posts;
    } catch (error) {
      console.log("Error fetching posts: ", error);
      return { error: "Error fetching posts" };
    }
  },

  createPost: async (
    c: Context
  ): Promise<{ message: string | null } | { error: string | null }> => {
    const validation = uploadPostSchema.safeParse(await c.req.json());

    if (!validation.success) {
      console.log(validation.data);
      return { error: `Invalid input : ${validation.error.flatten()}` };
    }

    const { content } = validation.data;

    const payload = c.get("jwtPayload");
    const userId = payload.id;

    try {
      await PostRepository.createPost(userId, content);
      return { message: "Successfully created post" };
    } catch (error) {
      console.log("Error creating post", error);
      throw error;
    }
  },
};
