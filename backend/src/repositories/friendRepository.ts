import {
  PrismaClient,
  User,
  FriendRequestStatus,
  FriendRequest,
} from "@prisma/client";
import { GetAllFriendsResponse } from "../interfaces/User/Friend/GetAllFriendsResponse";
import { GetOneFriendResponse } from "../interfaces/User/Friend/GetOneFriendResponse";
import { HTTPException } from "hono/http-exception";
import { getAllFriendRequestsResponse } from "../interfaces/User/Friend/GetAllFriendRequestsResponse";

const prisma = new PrismaClient();

export const FriendRepository = {
  getAllFriends: async (userId: number): Promise<GetAllFriendsResponse[]> => {
    const friendsWithLatestMessages = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userFriends: {
          select: {
            friend: {
              select: {
                id: true,
                email: true,
                name: true,
                username: true,
                receivedMessage: {
                  where: {
                    senderId: userId,
                  },
                  orderBy: {
                    createdAt: "desc",
                  },
                  take: 1,
                  select: {
                    id: true,
                    content: true,
                    createdAt: true,
                  },
                },
                sendedMesssage: {
                  where: {
                    receiverId: userId,
                  },
                  orderBy: {
                    createdAt: "desc",
                  },
                  take: 1,
                  select: {
                    id: true,
                    content: true,
                    createdAt: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!friendsWithLatestMessages) {
      // Handle the case where the user is not found
      throw new Error("User not found");
    }

    const friendsWithLatestMessagesResponse =
      friendsWithLatestMessages.userFriends.map((friendship) => {
        const friend = friendship.friend;
        const messages = [
          ...friend.sendedMesssage,
          ...friend.receivedMessage,
        ].filter((message) => message !== null);

        // Find the latest message among sent and received messages
        const latestMessage = messages.reduce(
          (latest, message) =>
            !latest || (message && message.createdAt > latest.createdAt)
              ? message
              : latest,
          null as { id: number; createdAt: Date; content: string | null } | null
        );

        return {
          id: friend.id,
          email: friend.email,
          name: friend.name,
          username: friend.username,
          latestMessage: latestMessage
            ? {
                id: latestMessage.id,
                content: latestMessage.content,
                createdAt: latestMessage.createdAt,
              }
            : null,
        };
      });
    return friendsWithLatestMessagesResponse;
  },

  getOneUserWithPosts: async (
    userId: number,
    otherUserId: number
  ): Promise<GetOneFriendResponse> => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: otherUserId },
      include: {
        posts: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isFriend = await prisma.friend.findFirst({
      where: {
        OR: [
          { userId: userId, friendId: otherUserId },
          { userId: otherUserId, friendId: userId },
        ],
      },
    });

    const { password, updatedAt, ...userWithoutPassword } = user;

    if (!isFriend) {
      return { ...userWithoutPassword, posts: [] };
    }

    return userWithoutPassword;
  },

  sendFriendRequest: async (
    senderId: number,
    receiverId: number
  ): Promise<FriendRequestStatus> => {
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        senderId,
        receiverId,
        status: {
          not: FriendRequestStatus.REJECTED, // Exclude rejected requests
        },
      },
    });

    if (existingRequest) {
      // If the existing request is rejected, update its status to pending
      if (existingRequest.status === FriendRequestStatus.REJECTED) {
        const updatedRequest = await prisma.friendRequest.update({
          where: {
            id: existingRequest.id,
          },
          data: {
            status: FriendRequestStatus.PENDING,
          },
        });
        return updatedRequest.status;
      }
      console.log("Friend request already pending");
      throw new HTTPException(400, {
        message: "Friend request already pending",
      });
    }

    const newRequest = await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId,
        status: FriendRequestStatus.PENDING,
      },
    });

    return newRequest.status;
  },

  getFriendRequest: async (senderId: number, receiverId: number) => {
    const friendRequest = await prisma.friendRequest.findFirst({
      where: {
        AND: [
          { senderId },
          { receiverId },
          { status: FriendRequestStatus.PENDING },
        ],
      },
    });

    if (!friendRequest) {
      throw new HTTPException(404, {
        message: "Friend request not found or already accepted",
      });
    }

    return friendRequest;
  },

  AcceptFriendRequest: async (
    id: number,
    senderId: number,
    receiverId: number
  ): Promise<FriendRequestStatus> => {
    const friendRequest = await prisma.friendRequest.update({
      where: {
        id: id,
      },
      data: {
        status: FriendRequestStatus.ACCEPTED,
      },
    });

    await prisma.friend.createMany({
      data: [
        { userId: senderId, friendId: receiverId },
        { userId: receiverId, friendId: senderId },
      ],
    });

    return friendRequest.status;
  },

  RejectFriendRequest: async (
    id: number,
    senderId: number,
    receiverId: number
  ): Promise<FriendRequestStatus> => {
    const friendRequest = await prisma.friendRequest.update({
      where: {
        id: id,
      },
      data: {
        status: FriendRequestStatus.REJECTED,
      },
    });

    return friendRequest.status;
  },

  getAllFriendRequests: async (
    userId: number
  ): Promise<getAllFriendRequestsResponse[]> => {
    const friendRequests = await prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
      },
      select: {
        id: true,
        senderId: true,
        status: true,
        createdAt: true,
        sender: {
          select: {
            profilePictureUrl: true,
            email: true,
            name: true,
            username: true,
          },
        },
      },
    });

    if (!friendRequests) {
      throw new HTTPException(404, { message: "Friend Request Not Found" });
    }

    return friendRequests;
  },
};
