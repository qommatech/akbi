import { Context, Hono } from "hono";
import postService from "../services/Post";
import { AppVariables } from "..";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import {
  getOnePostSchema,
  updatePostSchema,
  uploadPostSchema,
} from "../utils/schemas";

export const postRouter = new Hono<{ Variables: AppVariables }>()
  .get("/", async (c: Context) => {
    const result = await postService.index(c);

    if ("posts" in result) {
      return c.var.response("Successfully fetch posts data 😘", result.posts);
    }
    throw new HTTPException(500, { message: "Error fetching posts data" });
  })

  .get(
    "/:postId",
    zValidator("param", getOnePostSchema, (result, c) => {
      if (!result.success) {
        throw result.error.flatten().fieldErrors;
      }
    }),
    async (c: Context) => {
      const result = await postService.getOne(c);

      if ("post" in result) {
        return c.var.response("Successfully fetch post data 😘", result.post);
      }
      throw new HTTPException(500, {
        message: "Error fetching post data",
      });
    }
  )

  .post("/", async (c: Context) => {
    const formData = await c.req.formData();

    const data = {
      content: formData.get("content"),
      files: formData.getAll("files"),
    };

    const validation = uploadPostSchema.safeParse(data);

    if (!validation.success) {
      const flattenedErrors = validation.error.flatten();
      const errorMessage = Object.values(flattenedErrors.fieldErrors)
        .flat()
        .join(", ");
      throw new HTTPException(400, { message: errorMessage });
    }

    const result = await postService.create(validation.data, c);

    if ("message" in result) {
      return c.var.response("Successfully upload post 😘");
    }
    throw new HTTPException(500, {
      message: "Error uploading post",
    });
  })

  .put("/:id", async (c: Context) => {
    const formData = await c.req.formData();

    const data = {
      content: formData.get("content"),
      files: formData.getAll("files"),
    };

    const validation = updatePostSchema.safeParse(data);

    if (!validation.success) {
      const flattenedErrors = validation.error.flatten();
      const errorMessage = Object.values(flattenedErrors.fieldErrors)
        .flat()
        .join(", ");
      throw new HTTPException(400, { message: errorMessage });
    }
    const result = await postService.update(validation.data, c);

    if ("message" in result) {
      return c.var.response("Successfully update post 😘");
    }
    throw new Error("Error updating post");
  });
