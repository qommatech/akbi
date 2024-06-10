import { Context } from "hono";
import { FriendRepository } from "../../../repositories/friendRepository";
import { HTTPException } from "hono/http-exception";

export const getAllFriendRequests = async (c: Context) => {
  const userId = c.get("jwtPayload").id;

  try {
    const friendRequests = await FriendRepository.getAllFriendRequests(userId);

    return { friendRequests };
  } catch (error) {
    if (error instanceof HTTPException) {
      throw new HTTPException(error.status, { message: error.message });
    }
    console.log("Error getting friend requests : " + error);
    throw new HTTPException(500, {
      message: "Error responding friend request",
    });
  }
};
