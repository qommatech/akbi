import {
  PrismaClient,
  User,
  FriendRequestStatus,
  FriendRequest,
} from "@prisma/client";

const prisma = new PrismaClient();

export const FriendRepository = {
  getAllFriends: async (userId: number): Promise<any[]> => {
    const userWithFriends = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        username: true,

        userFriends: {
          include: {
            friend: true,
          },
        },
        friendUserFriends: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!userWithFriends) {
      throw new Error("User not found");
    }

    const friends = [
      ...userWithFriends.userFriends.map((friendship) => friendship.friend),
      ...userWithFriends.friendUserFriends.map((friendship) => friendship.user),
    ];

    // Fetch latest message for each friend
    const friendsWithLatestMessages = await Promise.all(
      friends.map(async (friend) => {
        const latestMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: userId, receiverId: friend.id },
              { senderId: friend.id, receiverId: userId },
            ],
          },
          orderBy: {
            createdAt: "desc",
          },
        });

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
      })
    );

    return friendsWithLatestMessages;
  },

  getOneUserWithPosts: async (
    userId: number,
    otherUserId: number
  ): Promise<any> => {
    // Fetch the other user
    const user = await prisma.user.findUnique({
      where: { id: otherUserId },
      include: {
        posts: true, // Include posts conditionally
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Check if the users are friends
    const isFriend = await prisma.friend.findFirst({
      where: {
        OR: [
          { userId: userId, friendId: otherUserId },
          { userId: otherUserId, friendId: userId },
        ],
      },
    });

    // Remove sensitive information
    const { password, updatedAt, ...userWithoutPassword } = user;

    if (!isFriend) {
      // If not friends, remove posts
      return { ...userWithoutPassword, posts: [] };
    }

    // If friends, include posts
    return userWithoutPassword;
  },

  sendFriendRequest: async (senderId: number, receiverId: number) => {
    // Check if a friend request already exists
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
        return { friendRequest: updatedRequest };
      }
      return { error: "Friend request already exists" };
    }

    // Create a new friend request
    const newRequest = await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId,
        status: FriendRequestStatus.PENDING,
      },
    });

    return { friendRequest: newRequest };
  },

  getFriendRequest: async (userId: number, otherUserId: number) => {
    return await prisma.friendRequest.findFirst({
      where: { senderId: otherUserId, receiverId: userId },
    });
  },

  updateFriendRequestStatus: async (
    requestId: number,
    status: FriendRequestStatus
  ) => {
    return await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status },
    });
  },

  createFriendship: async (userId: number, friendId: number) => {
    return await prisma.friend.createMany({
      data: [
        {
          userId,
          friendId,
        },
        {
          friendId,
          userId,
        },
      ],
    });
  },

  getAllFriendRequests: async (
    userId: number
  ): Promise<{ friendRequests: FriendRequest[] }> => {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        receivedFriendRequests: {
          include: {
            sender: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const sanitizedFriendRequests = user?.receivedFriendRequests.map(
      (request) => {
        const { sender, ...requestWithoutSender } = request;
        const { password, updatedAt, createdAt, ...sanitizedSender } = sender;
        return {
          ...requestWithoutSender,
          sender: sanitizedSender,
        };
      }
    );

    return { friendRequests: sanitizedFriendRequests };
  },
};
