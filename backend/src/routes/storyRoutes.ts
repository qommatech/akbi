import { Context, Hono } from "hono";
import { storyService } from "../services/storyService";

const storyRouter = new Hono();

storyRouter.get("/", async (c: Context) => {
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
});

storyRouter.get("/archive", async (c: Context) => {
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
});

storyRouter.get("/:id", async (c: Context) => {
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
});

storyRouter.post("/", async (c: Context) => {
  const result = await storyService.uploadStory(c);
  if (result && result.message) {
    return c.json(result, 200);
  } else {
    return c.json({ error: result?.error }, 400);
  }
});

storyRouter.delete("/:id", async (c: Context) => {
  const result = await storyService.deleteStory(c);
  if ("message" in result) {
    return c.json(result, 200);
  } else {
    return c.json({ error: result.error }, 400);
  }
});

storyRouter.post("/reply/:id", async (c: Context) => {
  const result = await storyService.replyStory(c);
  if ("message" in result) {
    return c.json(result, 200);
  } else {
    return c.json({ error: result.error }, 400);
  }
});

export { storyRouter };
