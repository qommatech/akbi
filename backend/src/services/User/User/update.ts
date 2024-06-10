import { Context } from "hono";
import { UserRepository } from "../../../repositories/userRepository";

export const update = async (c: Context): Promise<boolean> => {
  const { email, name, username } = c.req.valid("json" as never);
  const userId = c.get("jwtPayload").id;

  try {
    await UserRepository.updateUser(userId, email, name, username);
    return true;
  } catch (error) {
    console.error("Error updating users : ", error);
    throw new Error("Error updating users");
  }
};
