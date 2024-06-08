import { Context, Hono } from "hono";
import { storyService } from "../services/storyService";

export const storyRouter = new Hono()

    .get("/", async (c: Context) => {
        const result = await storyService.index(c);
        if ("stories" in result) {
            return c.json(
                {
                    message: "Successfully fetch all stories data",
                    stories: result.stories,
                },
                200
            );
        } else {
            return c.json({ error: result.error }, 400);
        }
    })

    .get("/archive", async (c: Context) => {
        const result = await storyService.getArchivedStories(c);
        if ("archivedStories" in result) {
            return c.json(
                {
                    message: "Successfully fetch archived stories",
                    archivedStories: result.archivedStories,
                },
                200
            );
        } else {
            return c.json({ error: result.error }, 400);
        }
    })

    .get("/:id", async (c: Context) => {
        const result = await storyService.getOneStory(c);
        if ("story" in result) {
            return c.json(
                {
                    message: "Successfully fetch story",
                    stories: result.story,
                },
                200
            );
        } else {
            return c.json({ error: result.error }, 400);
        }
    })

    .post("/", async (c: Context) => {
        const result = await storyService.uploadStory(c);
        if (result && result.message) {
            return c.json(result, 200);
        } else {
            return c.json({ error: result?.error }, 400);
        }
    })

    .delete("/:id", async (c: Context) => {
        const result = await storyService.deleteStory(c);
        if ("message" in result) {
            return c.json(result, 200);
        } else {
            return c.json({ error: result.error }, 400);
        }
    })

    .post("/reply/:id", async (c: Context) => {
        const result = await storyService.replyStory(c);
        if ("message" in result) {
            return c.json(result, 200);
        } else {
            return c.json({ error: result.error }, 400);
        }
    });
