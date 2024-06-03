import { Hono } from "hono";
import { FriendService } from "../services/friendService";
import { z } from "zod";

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

friendRouter.get("/other-user/:otherUserId", async (c) => {
  // Schema for Get One Friends
  const oneFriendsSchema = z.object({
    otherUserId: z.string().regex(/^\d+$/).transform(Number),
  });
  const payload = c.get("jwtPayload");
  const userId = payload.id;
  // Validate otherUserId using the schema
  const validation = oneFriendsSchema.safeParse({
    otherUserId: c.req.param("otherUserId"),
  });

  if (!validation.success) {
    return c.json(
      { error: "Invalid input", details: validation.error.flatten() },
      400
    );
  }

  const { otherUserId } = validation.data;

  const result = await FriendService.getOneUserWithPosts(userId, otherUserId);

  if ("error" in result) {
    return c.json({ error: result.error }, 400);
  }

  return c.json(
    {
      message: "Successfully fetched user and posts",
      user: result,
    },
    200
  );
});

friendRouter.post("/send", async (c) => {
  // Schema for Get Send Request Friends
  const sendFriendRequestSchema = z.object({
    receiverId: z.number().positive(),
  });
  const payload = c.get("jwtPayload");
  const senderId = payload.id;

  // Validate otherUserId using the schema
  const validation = sendFriendRequestSchema.safeParse(await c.req.json());

  if (!validation.success) {
    return c.json(
      { error: "Invalid input", details: validation.error.flatten() },
      400
    );
  }

  const { receiverId } = validation.data;

  const result = await FriendService.sendFriendRequest(senderId, receiverId);
  if (result.error) {
    return c.json({ error: result.error }, 400);
  }

  const status = result.friendRequest ? result.friendRequest.status : null;

  return c.json({ message: "Friend request sent", status }, 200);
});

friendRouter.post("/respond", async (c) => {
  // Schema for Respond Friend Request
  const respondFriendRequestSchema = z.object({
    accept: z.boolean({
      required_error: "isActive is required",
      invalid_type_error: "isActive must be a boolean",
    }),
    otherUserId: z.string().regex(/^\d+$/).transform(Number),
  });
  const payload = c.get("jwtPayload");
  const userId = payload.id;

  const validation = respondFriendRequestSchema.safeParse(await c.req.json());

  if (!validation.success) {
    return c.json(
      { error: "Invalid input", details: validation.error.flatten() },
      400
    );
  }

  const { accept, otherUserId } = validation.data;

  let result;
  if (accept === true) {
    result = await FriendService.acceptFriendRequest(userId, otherUserId);
  } else if (accept === false) {
    result = await FriendService.rejectFriendRequest(userId, otherUserId);
  } else {
    return c.json({ error: "Invalid action" }, 400);
  }

  if (result.error) {
    return c.json({ error: result.error }, 400);
  }

  return c.json({ message: result.message }, 200);
});

friendRouter.get("/request", async (c) => {
  const payload = c.get("jwtPayload");
  const userId = payload.id;

  const result = await FriendService.getAllFriendRequests(userId);

  if ("error" in result) {
    return c.json({ error: result.error }, 400);
  }

  return c.json(
    {
      message: "Successfully fetched all friend requests",
      friendRequests: result.friendRequests,
    },
    200
  );
});

export { friendRouter };
