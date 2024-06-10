import { Hono } from "hono";
import { z } from "zod";
import { Context } from "hono";
import { zValidator } from "@hono/zod-validator";
import s3Service from "../services/s3Service";
import {
  oneFriendsSchema,
  updateUserSchema,
  uploadProfilePictureSchema,
} from "../utils/schemas";
import userService from "../services/User/User";

export const userRouter = new Hono()

  .put(
    "/",
    zValidator("json", updateUserSchema, (result, c) => {
      if (!result.success) {
        throw result.error.flatten().fieldErrors;
      }
    }),
    async (c: Context) => {
      const result = await userService.update(c);

      if (result) {
        return c.var.response("Successfully updated user data");
      }
      throw new Error("Error updating users");
    }
  )

  .put(
    "/profile-picture",
    zValidator("form", uploadProfilePictureSchema, (result, c) => {
      if (!result.success) {
        throw result.error.flatten().fieldErrors;
      }
    }),
    async (c: Context) => {
      console.log(c.req.valid("form" as never));
      const result = await userService.changeAvatar(c);

      if (result) {
        return c.var.response("Successfully upload  avatar");
      }
      throw new Error("Error uploading users avatar");
    }
  )

  .get("/", async (c: Context) => {
    const result = await userService.getMe(c);
    console.log(result);

    if ("user" in result) {
      return c.var.response("Successfully fetch user data", result.user);
    }
    throw new Error("Error fetching user data");
  })

  .get(
    "/:otherUserId",
    zValidator("param", oneFriendsSchema, (result, c) => {
      if (!result.success) {
        throw result.error.flatten().fieldErrors;
      }
    }),
    async (c: Context) => {
      const result = await userService.getOneUser(c);

      if ("user" in result) {
        return c.var.response(
          "Successfully fetch other user data",
          result.user
        );
      }
      throw new Error("Error fetching posts");
    }
  );
