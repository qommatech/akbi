import { PrismaClient, Message } from "@prisma/client";

const prisma = new PrismaClient();

export const fetchMessagesBetweenUsers = async (
  senderId: number,
  receiverId: number
) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};
