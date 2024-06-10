// src/repositories/userRepository.ts
import { PrismaClient, User } from "@prisma/client";
import { compare, compareSync } from "bcryptjs";
import { LoginResponse } from "../interfaces/Auth/LoginResponse";
import { GetMeResponse } from "../interfaces/User/User/GetMeResponse";
import { GetOneUserResponse } from "../interfaces/User/User/GetOneUserResponse";
const prisma = new PrismaClient();

export const UserRepository = {
  findByUsernameAndPassword: async (
    username: string,
    password: string
  ): Promise<LoginResponse> => {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: {
            userFriends: true,
            posts: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const passwordMatch = compareSync(password, user.password);

    if (!passwordMatch) {
      throw new Error("Unauthenticated");
    }

    return user;
  },

  findByEmail: async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { email } });
  },

  addUser: async (
    userData: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
  ): Promise<User> => {
    return await prisma.user.create({
      data: userData as Omit<User, "id" | "createdAt" | "updated">,
    });
  },

  getMe: async (userId: number): Promise<GetMeResponse> => {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        email: true,
        username: true,
        name: true,
        profilePictureUrl: true,

        userFriends: {
          select: {
            friend: {
              select: {
                id: true,
                username: true,
                email: true,
                profilePictureUrl: true,
              },
            },
          },
        },

        posts: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },

        stories: {
          where: {
            createdAt: {
              gte: twentyFourHoursAgo,
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    return {
      email: user.email,
      username: user.username,
      name: user.name,
      profilePictureUrl: user.profilePictureUrl,
      friends: user.userFriends.map((userFriend) => userFriend.friend),
      posts: user.posts,
      stories: user.stories,
    };
  },
  getOneUser: async (
    userId: number,
    otherUserId: number
  ): Promise<GetOneUserResponse> => {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: otherUserId },
      select: {
        email: true,
        username: true,
        name: true,
        profilePictureUrl: true,
        userFriends: {
          where: {
            friendId: userId,
          },
          select: {
            friendId: true,
          },
        },
        posts: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
        stories: {
          where: {
            createdAt: {
              gte: twentyFourHoursAgo,
            },
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    const isFriend = user.userFriends.length > 0;

    return {
      email: user.email,
      username: user.username,
      name: user.name,
      profilePictureUrl: user.profilePictureUrl,
      posts: isFriend ? user.posts : [],
      stories: isFriend ? user.stories : [],
      isFriends: isFriend ? true : false,
    };
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
    return await prisma.user.update({
      where: { id: userId },
      data: {
        profilePictureUrl: profilePictureUrl,
      },
    });
  },
};
