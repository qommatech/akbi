import { PrismaClient, User } from "@prisma/client";

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
};
