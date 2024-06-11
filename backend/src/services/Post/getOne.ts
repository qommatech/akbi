import { Context } from "hono";
import { PostRepository } from "../../repositories/postRepository";
import { HTTPException } from "hono/http-exception";

export const getOne = async (c: Context) => {
  const { postId } = c.req.valid("param" as never);

  const userId = c.get("jwtPayload").id;

  try {
    const post = await PostRepository.getOnePost(userId, postId);
    return { post };
  } catch (error) {
    console.log("Error Fetching post: ", error);
    if (error instanceof HTTPException) {
      throw new HTTPException(500, { message: "Error fetching posts" });
    }
    return { error: "Error fetching post" };
  }
};
