import { Context, Hono } from "hono";
import postService from "../services/Post";
import { AppVariables } from "..";

export const postRouter = new Hono<{ Variables: AppVariables }>()
  .get("/", async (c: Context) => {
    const result = await postService.index(c);

    if ("posts" in result) {
      return c.var.response("Successfully fetch posts data 😘", result.posts);
    }
    throw new Error("Error fetching posts");
  })

  .get("/:id", async (c: Context) => {
    const result = await postService.getOne(c);

    if ("post" in result) {
      return c.var.response("Successfully fetch posts data 😘", result.post);
    }
    throw new Error("Error fetching posts");
  })

  .post("/", async (c: Context) => {
    const result = await postService.create(c);

    if ("message" in result) {
      return c.var.response("Successfully upload post 😘");
    }
    throw new Error("Error fetching posts");
  })
  .put("/:id", async (c: Context) => {
    const result = await postService.update(c);

    if ("message" in result) {
      return c.var.response("Successfully update post 😘");
    }
    throw new Error("Error fetching posts");
  });
