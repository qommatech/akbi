import { Context } from "hono";
import { FriendRepository } from "../../../repositories/friendRepository";

export const sendFriendRequest = async (c: Context) => {
  const { receiverId } = c.req.valid("json" as never);
  const senderId = c.get("jwtPayload").id;

  try {
    const status = await FriendRepository.sendFriendRequest(
      senderId,
      receiverId
    );
    return { status };
  } catch (error) {
    console.log("Error sending friend request : " + error);
    throw new Error("Error sending friend request");
  }
};
