import { Context, Hono } from "hono";
import { postService } from "../services/postService";

export const postRouter = new Hono()
    .get("/", async (c: Context) => {
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
    })

    .get("/:id", async (c: Context) => {
        const result = await postService.getOnePost(c);
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
        const result = await postService.createPost(c);
        if ("message" in result) {
            return c.json({ message: result.message }, 200);
        } else {
            return c.json({ error: result.error }, 400);
        }
    });
