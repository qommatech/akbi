import { Context, Hono } from "hono";
// import { postService } from "../services/postService";
import postService from "../services/Post";
import { ApiResponse } from "../interfaces/ApiResponse";

export const postRouter = new Hono()
  .get("/", async (c: Context) => {
    const result = await postService.index(c);
    const response: ApiResponse<any> = {};
    if ("posts" in result) {
      response.data = result.posts;
      response.message = "Successfully fetch all posts data";
      return c.json(response, 200);
    } else {
      response.error = result.error;
      return c.json(response, 400);
    }
  })

  .get("/:id", async (c: Context) => {
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
  })

  .post("/", async (c: Context) => {
    const result = await postService.create(c);
    if ("message" in result) {
      return c.json({ message: result.message }, 200);
    } else {
      return c.json({ error: result.error }, 400);
    }
  })
  .put("/:id", async (c: Context) => {
    const result = await postService.update(c);
    if ("message" in result) {
      return c.json({ message: result.message }, 200);
    } else {
      return c.json({ error: result.error }, 400);
    }
  });
