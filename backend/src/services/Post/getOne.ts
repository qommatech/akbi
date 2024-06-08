import { Context } from "hono";
import { PostRepository } from "../../repositories/postRepository";

export const getOne = async (c: Context) => {
  const payload = c.get("jwtPayload");
  const userId = payload.id;

  const postId = parseInt(c.req.param("id"), 10);

  try {
    const post = await PostRepository.getOnePost(userId, postId);
    return { post };
  } catch (error) {
    console.log("Error Fetching post: ", error);
    return { error: "Error fetching post" };
  }
};
