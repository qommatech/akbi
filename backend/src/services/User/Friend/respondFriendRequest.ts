import { Context } from "hono";
import { FriendRepository } from "../../../repositories/friendRepository";
import { HTTPException } from "hono/http-exception";

export const respondFriendRequest = async (c: Context) => {
  const { accept, senderId } = c.req.valid("json" as never);
  const receiverId = c.get("jwtPayload").id;

  try {
    const friendRequest = await FriendRepository.getFriendRequest(
      senderId,
      receiverId
    );

    const status =
      accept === true
        ? await FriendRepository.AcceptFriendRequest(
            friendRequest.id,
            senderId,
            receiverId
          )
        : await FriendRepository.RejectFriendRequest(
            friendRequest.id,
            senderId,
            receiverId
          );

    return { status };
  } catch (error) {
    if (error instanceof HTTPException) {
      throw new HTTPException(error.status, { message: error.message });
    }
    throw new HTTPException(500, {
      message: "Error responding friend request from service",
    });
  }
};
