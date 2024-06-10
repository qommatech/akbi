import { z } from "zod";

/**
 * Zod Validation
 */

export const email = z.string().email("Please provide a valid email.");
export const name = z.string().max(50, "Maximum name length is 50.");
export const username = z
  .string()
  .max(10, "Maximum username length is 10.")
  .min(6, "Minimum username length is 6.")
  .toLowerCase();
export const password = z
  .string()
  .max(15, "Maximum password length is 15.")
  .min(6, "Minimum password length is 6.");

// Other User validation
const otherUserId = z.string().regex(/^\d+$/).transform(Number);
// Sender User validation
const senderId = z.string().regex(/^\d+$/).transform(Number);

// Avatar validation
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const avatar = z
  .instanceof(File)
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: "Invalid file type",
  })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "File size exceeds the limit of 5MB",
  });

export const accept = z.boolean({
  required_error: "isActive is required",
  invalid_type_error: "isActive must be a boolean",
});

/**
 * Schemas
 */

// Schema for Get One Friends
export const uploadProfilePictureSchema = z.object({
  avatar,
});

export const registerSchema = z.object({
  email,
  name,
  username,
  password,
});

export const loginSchema = z.object({
  username,
  password,
});

export const updateUserSchema = z.object({
  email,
  name,
  username,
});

export const oneFriendsSchema = z.object({
  otherUserId,
});

export const sendFriendRequestSchema = z.object({
  receiverId: z.number().positive(),
});

export const respondFriendRequestSchema = z.object({
  accept,
  senderId,
});
