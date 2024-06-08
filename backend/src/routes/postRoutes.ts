import { Context, Hono } from "hono";
// import { postService } from "../services/postService";
import postService from "../services/Post";

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

postRouter.get("/:id", async (c: Context) => {
  const result = await postService.getOne(c);
  if ("post" in result) {
    return c.json(
      {
        message: "Successfully fetch post data",
        post: result.post,
      },
      200
    );
  } else {
    return c.json({ error: result.error }, 400);
  }
});

postRouter.put("/:id", async (c: Context) => {
  const result = await postService.update(c);
  if ("message" in result) {
    return c.json({ message: result.message }, 200);
  } else {
    return c.json({ error: result.error }, 400);
  }
});

postRouter.post("/", async (c: Context) => {
  const result = await postService.create(c);
  if ("message" in result) {
    return c.json({ message: result.message }, 200);
  } else {
    return c.json({ error: result.error }, 400);
  }
});

export { postRouter };
