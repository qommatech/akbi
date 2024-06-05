// src/repositories/userRepository.ts
import { PrismaClient, User } from "@prisma/client";
import { compare, compareSync } from "bcryptjs";
const prisma = new PrismaClient();

export const UserRepository = {
  findByUsernameAndPassword: async (
    username: string,
    password: string
  ): Promise<User | null> => {
    // Find the user by username
    const user: User | null = await prisma.user.findUnique({
      where: { username },
      include: {
        userFriends: true,
        posts: true,
      },
    });

    if (!user) {
      return null; // User with the given username does not exist
    }

    // Verify the password
    const passwordMatch = compareSync(password, user.password);

    if (!passwordMatch) {
      return null; // Passwords do not match
    }

    return user; // Authentication successful
  },
  findByEmail: async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { email } });
  },
  addUser: async (
    userData: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
  ): Promise<User> => {
    return prisma.user.create({
      data: userData as Omit<User, "id" | "createdAt" | "updated">,
    });
  },

  updateUser: async (
    userId: number,
    email: string,
    name: string,
    username: string
  ) => {
    return prisma.user.update({
      where: { id: userId },
      data: {
        email,
        name,
        username,
      },
    });
  },

  changeAvatar: async (userId: number, profilePictureUrl: string) => {
    return prisma.user.update({
      where: { id: userId },
      data: {
        profilePictureUrl: profilePictureUrl,
      },
    });
  },
};
