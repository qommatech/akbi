import { Context } from "hono";
import { UserRepository } from "../../../repositories/userRepository";

export const getMe = async (c: Context) => {
  const userId = c.get("jwtPayload").id;

  try {
    const user = await UserRepository.getMe(userId);
    return { user };
  } catch (error) {
    console.error("Error fetching user and posts: ", error);
    throw new Error("Error fetching user and posts");
  }
};
