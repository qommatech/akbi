import { PrismaClient, User, Post } from "@prisma/client";

const prisma = new PrismaClient();

export const PostRepository = {
  getAllPosts: async (
    userId: number
  ): Promise<{ posts: Post[] } | { error: string }> => {
    const friends = await prisma.friend.findMany({
      where: {
        OR: [{ userId: userId }, { friendId: userId }],
      },
      select: {
        user: true,
        friend: true,
      },
    });

    const friendIds = friends.map((friend) =>
      friend.user.id === userId ? friend.friend.id : friend.user.id
    );

    try {
      const posts = await prisma.post.findMany({
        where: {
          authorId: {
            in: friendIds,
          },
        },
        include: {
          author: true,
          reactions: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const sanitizedPosts = posts.map((post) => {
        const { author, ...rest } = post;
        const { email, password, createdAt, updatedAt, ...sanitizedAuthor } =
          author;
        return {
          ...rest,
          author: sanitizedAuthor,
        };
      });
      return { posts: sanitizedPosts };
    } catch (error) {
      console.log("Error fetching posts: ", error);
      return { error: "Error fetching posts" };
    }
  },

  createPost: async (userId: number, content: string) => {
    return await prisma.post.create({
      data: {
        authorId: userId,
        content,
      },
    });
  },
};
