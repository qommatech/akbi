import { Hono } from "hono";
import { FriendService } from "../services/friendService";

const friendRouter = new Hono();

friendRouter.get("/", async (c) => {
  const payload = c.get("jwtPayload");
  const userId = payload.id;
  const result = await FriendService.index(userId);
  if ("friends" in result) {
    return c.json(
      {
        message: "Successfully fetch all friends data",
        friends: result.friends,
      },
      200
    );
  } else {
    return c.json({ error: result.error }, 400);
  }
});

export { friendRouter };
