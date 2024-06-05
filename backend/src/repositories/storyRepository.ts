import { PrismaClient, User, Story } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateStoryParams {
  creatorId: number;
  content: string;
}

export const StoryRepository = {
  getAllStories: async (
    userId: number
  ): Promise<{ stories: Story[] } | { error: string }> => {
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
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const stories = await prisma.story.findMany({
        where: {
          creatorId: {
            in: friendIds,
          },
          createdAt: {
            gte: twentyFourHoursAgo,
          },
        },
        include: {
          creator: true,
          viewers: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const sanitizedStories = stories.map((story) => {
        const { creator, ...rest } = story;
        const { email, password, createdAt, updatedAt, ...sanitizedCreator } =
          creator;
        return {
          ...rest,
          creator: sanitizedCreator,
        };
      });
      return { stories: sanitizedStories };
    } catch (error) {
      console.log("Error fetching stories: ", error);
      return { error: "Error fetching stories" };
    }
  },

  getArchivedStories: async (userId: number) => {
    const archivedStories = await prisma.story.findMany({
      where: { creatorId: userId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { archivedStories: archivedStories };
  },

  getOneStory: async (storyId: number, userId: number) => {
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: {
        creator: true,
        viewers: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!story) {
      return { error: "Story not found" };
    }

    // Check if the viewer is not the creator and has not already viewed the story
    if (story.creatorId !== userId) {
      const viewerExists = story.viewers.some(
        (viewer) => viewer.userId === userId
      );
      if (!viewerExists) {
        // Add the viewer to the story's viewers
        await prisma.storyViewer.create({
          data: {
            storyId: story.id,
            userId: userId,
            viewedAt: new Date(),
          },
        });
      }
    }

    // Remove sensitive fields from the creator and viewers
    const {
      email: creatorEmail,
      password: creatorPassword,
      createdAt: creatorCreatedAt,
      updatedAt: creatorUpdatedAt,
      ...sanitizedCreator
    } = story.creator;
    const sanitizedViewers = story.viewers.map((viewer) => {
      const { storyId: storyId, userId: userId, ...sanitizedViewer } = viewer;
      const {
        createdAt: viewerCreatedAt,
        updatedAt: viewerUpdatedAt,
        email: viewerEmail,
        password: viewerPassword,
        ...sanitizedUser
      } = viewer.user;
      return {
        ...sanitizedViewer,
        user: sanitizedUser,
      };
    });

    // Conditionally exclude viewers if the requester is not the creator
    let sanitizedStory;
    if (story.creatorId === userId) {
      sanitizedStory = {
        ...story,
        creator: sanitizedCreator,
        viewers: sanitizedViewers,
      };
    } else {
      const { viewers, ...rest } = story;
      sanitizedStory = {
        ...rest,
        creator: sanitizedCreator,
      };
    }

    return { story: sanitizedStory };
  },

  createStory: async (creatorId: number, content: string) => {
    return await prisma.story.create({
      data: {
        creatorId,
        content,
      },
    });
  },

  deleteStory: async (storyId: number, userId: number) => {
    return await prisma.story.delete({
      where: { id: storyId, creatorId: userId },
    });
  },

  replyStory: async (
    storyId: number,
    receiverId: number,
    userId: number,
    content: string
  ) => {
    return await prisma.message.create({
      data: {
        senderId: userId,
        receiverId: receiverId,
        content: content,
        storyId: storyId,
      },
    });
  },
};
