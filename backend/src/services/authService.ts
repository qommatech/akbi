// src/services/authService.ts
import { decode, sign, verify } from "hono/jwt";
import { User } from "@prisma/client";
import { hash } from "bcryptjs";
import { UserRepository } from "../repositories/userRepository";

const secretKey = process.env.SECRET_KEY;

export const AuthService = {
  register: async (
    email: string,
    name: string,
    username: string,
    password: string
  ): Promise<{ token: string } | { error: string }> => {
    try {
      // Check if the email or username already exists
      const existingUser = await UserRepository.findByEmail(email);
      if (existingUser) {
        return { error: "Email already exists" };
      }

      // Hash the password
      const hashedPassword = await hash(password, 10);

      // Create the user
      const newUser = await UserRepository.addUser({
        email,
        name,
        username,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = await sign(
        {
          id: newUser.id,
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        secretKey as string
      );

      return { token };
    } catch (error) {
      console.error("Error registering user:", error);
      return { error: "Registration failed" };
    }
  },

  login: async (username: string, password: string): Promise<any | null> => {
    const user: User | null = await UserRepository.findByUsernameAndPassword(
      username,
      password
    );
    if (user !== null) {
      return await sign(
        {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          totalPost: user.posts.length,
          totalFriend: user.userFriends.length,
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        secretKey as string
      );
    }
    return null;
  },

  verifyToken: (token: string): any => {
    try {
      return verify(token, secretKey as string);
    } catch (error) {
      return null;
    }
  },
};
