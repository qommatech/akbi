import { sign } from "hono/jwt";
import { UserRepository } from "../../repositories/userRepository";
import { LoginResponse } from "../../interfaces/Auth/LoginResponse";

const secretKey = process.env.SECRET_KEY;

export const login = async (
  username: string,
  password: string
): Promise<{ token: string }> => {
  const user: LoginResponse = await UserRepository.findByUsernameAndPassword(
    username,
    password
  );

  if (user !== null) {
    const token = await sign(
      {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        totalPost: user._count.posts,
        totalFriend: user._count.userFriends,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      secretKey as string
    );
    return { token };
  }

  throw new Error("Unauthenticated");
};
