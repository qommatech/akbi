// src/saveMessage.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const saveMessage = async (
  senderId: number,
  receiverId: number,
  content: string
) => {
  try {
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });
    console.log("Message saved:", message);
    return message;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};

// // Example usage
// (async () => {
//   const senderId = 1; // Replace with actual sender ID
//   const receiverId = 2; // Replace with actual receiver ID
//   const content = "Hello, how are you?";

//   try {
//     const message = await saveMessage(senderId, receiverId, content);
//     console.log("Message saved successfully:", message);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// })();
