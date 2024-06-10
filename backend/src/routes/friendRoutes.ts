import { Context, Hono } from "hono";
import { AppVariables } from "..";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import {
  oneFriendsSchema,
  respondFriendRequestSchema,
  sendFriendRequestSchema,
} from "../utils/schemas";
import { GetOneFriendResponse } from "../interfaces/User/Friend/GetOneFriendResponse";
import friendService from "../services/User/Friend";
import { HTTPException } from "hono/http-exception";

export const friendRouter = new Hono<{ Variables: AppVariables }>()
  .get("/", async (c: Context) => {
    const result = await friendService.getAll(c);

    if ("friends" in result) {
      return c.var.response(
        "Successfully fetch friends data 😘",
        result.friends
      );
    }
    throw new HTTPException(500, { message: "Error fetching posts" });
  })

  .post(
    "/request-friend",
    zValidator("json", sendFriendRequestSchema, (result, c) => {
      if (!result.success) {
        throw result.error.flatten().fieldErrors;
      }
    }),
    async (c: Context) => {
      const result = await friendService.sendFriendRequest(c);

      if ("status" in result) {
        return c.var.response(
          "Successfully send friend request 😘",
          result.status
        );
      }
      throw new HTTPException(500, {
        message: "Error sending friend request",
      });
    }
  )

  .post(
    "/respond",
    zValidator("json", respondFriendRequestSchema, (result, c) => {
      if (!result.success) {
        throw result.error.flatten().fieldErrors;
      }
    }),
    async (c) => {
      const result = await friendService.respondFriendRequest(c);

      if ("status" in result) {
        return c.var.response(
          `Successfully ${result.status} friend request`,
          result.status
        );
      }
      throw new HTTPException(500, {
        message: "Error respond friend requests",
      });
    }
  )

  .get("/request", async (c: Context) => {
    const result = await friendService.getAllFriendRequests(c);

    if ("friendRequests" in result) {
      return c.var.response(
        "Successfully fetch request friends data 😘",
        result.friendRequests
      );
    }
    throw new HTTPException(500, { message: "Error fetching friend requests" });
  });
