import { Context } from "hono";
import { UserRepository } from "../../../repositories/userRepository";

export const getOneUser = async (c: Context) => {
  const { otherUserId } = c.req.valid("param" as never);
  const userId = c.get("jwtPayload").id;

  console.log(otherUserId);
  try {
    const user = await UserRepository.getOneUser(userId, otherUserId);
    return { user };
  } catch (error) {
    console.error("Error fetching other user: ", error);
    throw new Error("Error fetching other user");
  }
};
