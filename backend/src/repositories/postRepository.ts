import { PrismaClient, Post, Reaction } from "@prisma/client";
import { GetOnePostResponse } from "../interfaces/Post/GetOnePostResponse";
import { GetAllPostsResponse } from "../interfaces/Post/GetAllPostsResponse";

// Define a type for the reaction counts
type ReactionCounts = {
  [key in Reaction]: number;
};

const prisma = new PrismaClient();

export const PostRepository = {
  getAllPosts: async (userId: number): Promise<GetAllPostsResponse[]> => {
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
          postAsset: {
            select: {
              id: true,
              url: true,
              type: true,
            },
          },
          reactions: {
            select: {
              reaction: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

      const sanitizedPosts = posts.map((post) => {
        const { author, reactions, ...rest } = post;
        const {
          id,
          email,
          password,
          createdAt,
          updatedAt,
          ...sanitizedAuthor
        } = author;

        // Initialize reaction counts
        const reactionCounts: Partial<ReactionCounts> = {};

        // Count reactions by type
        reactions.forEach(({ reaction }) => {
          reactionCounts[reaction] = (reactionCounts[reaction] || 0) + 1;
        });

        return {
          ...rest,
          author: sanitizedAuthor,
          reactions: reactionCounts,
        };
      });

      return sanitizedPosts;
    } catch (error) {
      console.log("Error fetching posts: ", error);
      throw new Error("Error fetching posts");
    }
  },

  getOnePost: async (
    userId: number,
    postId: number
  ): Promise<GetOnePostResponse> => {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePictureUrl: true,
          },
        },
        postAsset: {
          select: {
            url: true,
            type: true,
          },
        },
        reactions: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                profilePictureUrl: true,
              },
            },
            reaction: true,
          },
        },
      },
    });

    if (!post) {
      throw new Error("Post not found or user not authorized to view the post");
    }

    // Initialize reactionCounts with an empty object
    const reactionCounts: Partial<
      Record<Reaction, { count: number; users: any[] }>
    > = {};

    // Process reactions to build the reactionCounts object
    post.reactions.forEach(({ reaction, user }) => {
      if (!reactionCounts[reaction]) {
        reactionCounts[reaction] = { count: 0, users: [] };
      }
      reactionCounts[reaction]!.count++;
      reactionCounts[reaction]!.users.push({
        id: user.id,
        username: user.username,
        profilePictureUrl: user.profilePictureUrl,
      });
    });

    return {
      id: post.id,
      postAsset: post.postAsset,
      author: post.author,
      content: post.content,
      createdAt: post.createdAt,
      reactions: reactionCounts,
    };
  },

  createPost: async (userId: number, content: string) => {
    return await prisma.post.create({
      data: {
        authorId: userId,
        content,
      },
    });
  },

  updatePost: async (postId: number, content: string) => {
    return await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        content,
      },
    });
  },

  createPostAsset: async (postId: number, assets: any[]) => {
    return await prisma.postAsset.createMany({
      data: assets.map((asset) => ({
        postId: postId,
        url: asset.url,
        type: asset.type,
      })),
    });
  },

  deletePostAssets: async (postId: number) => {
    return await prisma.postAsset.deleteMany({
      where: {
        postId: postId,
      },
    });
  },
};
