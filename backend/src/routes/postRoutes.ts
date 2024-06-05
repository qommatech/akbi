import { Context, Hono } from "hono";
import { postService } from "../services/postService";

const postRouter = new Hono();

postRouter.get("/", async (c: Context) => {
  const result = await postService.index(c);
  if ("posts" in result) {
    return c.json(
      {
        message: "Successfully fetch all posts data",
        posts: result.posts,
      },
      200
    );
  } else {
    return c.json({ error: result.error }, 400);
  }
});

postRouter.post("/", async (c: Context) => {
  const result = await postService.createPost(c);
  if ("message" in result) {
    return c.json(result.message, 200);
  } else {
    return c.json({ error: result.error }, 400);
  }
});

export { postRouter };
