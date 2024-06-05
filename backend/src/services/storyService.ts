import { Context } from "hono";
import { StoryRepository } from "../repositories/storyRepository";
import { z } from "zod";
import { getVideoDurationInSeconds } from "get-video-duration";
import { PassThrough } from "stream";
import s3Service from "./s3Service";
import { Story } from "@prisma/client";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/ogg",
];

const uploadStorySchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Invalid file type",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size exceeds the limit of 5MB",
    }),
});

// Validate video duration function
const validateVideoDuration = async (fileBuffer: Buffer): Promise<boolean> => {
  try {
    const stream = new PassThrough();
    stream.end(fileBuffer);
    const duration = await getVideoDurationInSeconds(stream);
    return duration <= 15; // Check if duration is less than or equal to 15 seconds
  } catch (error) {
    console.error("Error getting video duration:", error);
    return false;
  }
};

export const storyService = {
  index: async (
    c: Context
  ): Promise<{ stories: Story[] } | { error: string }> => {
    const payload = c.get("jwtPayload");
    const userId = payload.id;
    try {
      const stories = await StoryRepository.getAllStories(userId);
      return stories;
    } catch (error) {
      console.log("Error fetching stories: ", error);
      return { error: "Error fetching stories" };
    }
  },

  getArchivedStories: async (
    c: Context
  ): Promise<
    { archivedStories: Story[] | null } | { error: string | null }
  > => {
    const payload = c.get("jwtPayload");
    const userId = payload.id;
    try {
      const archivedStories = await StoryRepository.getArchivedStories(userId);
      return archivedStories;
    } catch (error) {
      console.log("Error fetching archived stories: ", error);
      return { error: "Error fetching archived stories" };
    }
  },

  getOneStory: async (
    c: Context
  ): Promise<{ story: Story | null } | { error: string | null }> => {
    const payload = c.get("jwtPayload");
    const userId = payload.id;
    const storyId = parseInt(c.req.param("id"), 10);
    try {
      const story = await StoryRepository.getOneStory(storyId, userId);
      return story;
    } catch (error) {
      console.log("Error fetching story: ", error);
      return { error: "Error fetching story" };
    }
  },

  uploadStory: async (
    c: Context
  ): Promise<{ message?: string; error?: string } | undefined> => {
    const validation = uploadStorySchema.safeParse(await c.req.parseBody());

    if (!validation.success) {
      console.log(validation.data);
      return { error: `Invalid input : ${validation.error.flatten()}` };
    }

    const payload = c.get("jwtPayload");
    const userId = payload.id;
    const username = payload.username;

    const { file } = validation.data;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    // Convert Blob to Buffer
    const arrBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrBuffer);

    if (isImage) {
      const filename = `stories/${username}/${Date.now()}.png`;

      try {
        const storiesUrl = await s3Service.uploadFile(buffer, filename);
        await StoryRepository.createStory(userId, storiesUrl);
        return { message: "Successfully uploaded" };
      } catch (error) {
        console.log("Error uploading stories", error);
        throw error;
      }
    } else if (isVideo) {
      console.log("File video");
      const isValid = await validateVideoDuration(buffer);
      console.log(isValid);
      if (!isValid) {
        return { error: "Invalid video duration" };
      }

      const filename = `stories/${username}/${Date.now()}.mp4`;

      console.log(file);

      try {
        const storiesUrl = await s3Service.uploadFile(
          buffer,
          filename,
          isVideo,
          file
        );
        await StoryRepository.createStory(userId, storiesUrl);
        return { message: "Successfully uploaded" };
      } catch (error) {
        console.log("Error uploading stories", error);
        throw error;
      }
    }
  },

  deleteStory: async (
    c: Context
  ): Promise<{ message: string | null } | { error: string | null }> => {
    const payload = c.get("jwtPayload");
    const userId = payload.id;
    const storyId = parseInt(c.req.param("id"), 10);

    try {
      await StoryRepository.deleteStory(storyId, userId);
      return { message: "Successfully delete story" };
    } catch (error) {
      console.log("Error deleting stories", error);
      throw error;
    }
  },
};
