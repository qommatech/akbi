import { Context } from "hono";
import { FriendRepository } from "../../../repositories/friendRepository";
import { HTTPException } from "hono/http-exception";

export const getAll = async (c: Context) => {
  const userId = c.get("jwtPayload").id;

  try {
    const friends = await FriendRepository.getAllFriends(userId);
    return { friends };
  } catch (error) {
    if (error instanceof HTTPException) {
      console.log("Error fetching friends : " + error.message);
      throw new HTTPException(error.status, { message: error.message });
    }
    console.log("Error fetching friends : " + error);
    throw new Error("Error fetching friends");
  }
};
