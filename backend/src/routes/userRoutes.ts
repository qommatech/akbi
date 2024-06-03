import { Hono } from "hono";
import { userService } from "../services/userService";
import s3Service from "../services/s3Service";
import { z } from "zod";
import * as fs from "fs";
import { hash, hashSync } from "bcryptjs";

const userRouter = new Hono();

userRouter.put("/", async (c) => {
  // Schema for update User
  const updateUserSchema = z.object({
    email: z.string().email(),
    name: z.string().max(50),
    username: z.string().max(10),
  });

  // Validate otherUserId using the schema
  const validation = updateUserSchema.safeParse(await c.req.json());
  if (!validation.success) {
    return c.json(
      { error: "Invalid input", details: validation.error.flatten() },
      400
    );
  }

  const { email, name, username } = validation.data;

  const payload = c.get("jwtPayload");
  const userId = payload.id;

  const result = await userService.updateUser(userId, email, name, username);

  if ("error" in result) {
    return c.json({ error: result.error }, 400);
  }

  return c.json({ message: "Successfull update user" }, 201);
});

userRouter.put("/profile-picture", async (c) => {
  const MAX_FILE_SIZE = 5000000;
  const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  // Schema for Get One Friends
  const uploadProfilePictureSchema = z.object({
    file: z.instanceof(File),
  });
  // Validate otherUserId using the schema
  const validation = uploadProfilePictureSchema.safeParse(
    await c.req.parseBody()
  );

  if (!validation.success) {
    console.log(validation.data);
    return c.json(
      { error: "Invalid input", details: validation.error.flatten() },
      400
    );
  }
  const payload = c.get("jwtPayload");
  const username = payload.username;

  const { file } = validation.data;
  const arrBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrBuffer);

  const filename = `avatar/${username}.png`;

  const s3Handler = await s3Service.uploadFile(buffer, filename);

  return c.text(s3Handler);
});

userRouter.get("/:otherUserId", async (c) => {
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

  const result = await userService.getOneUserWithPosts(userId, otherUserId);

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

export { userRouter };
