import { hash, hashSync } from "bcryptjs";
import { UserRepository } from "../../repositories/userRepository";
import { sign } from "hono/jwt";

const secretKey = process.env.SECRET_KEY;

export const register = async (
  email: string,
  name: string,
  username: string,
  password: string
): Promise<{ token: string }> => {
  try {
    const existingUser = await UserRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = hashSync(password, 10);

    const newUser = await UserRepository.addUser({
      email,
      name,
      username,
      password: hashedPassword,
    });

    const token = await sign(
      {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        totalPosts: 0,
        totalFriends: 0,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      secretKey as string
    );

    return { token };
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error("Error registering user " + error);
  }
};
