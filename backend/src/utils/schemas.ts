import { z } from "zod";
import { zfd } from "zod-form-data";

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
// Get One Post Validation
const postId = z.string().regex(/^\d+$/).transform(Number);

// Avatar validation
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Post
const MAX_POST_FILE_SIZE = 10000000;
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/ogg",
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

// Post validation
export const content = zfd.text(
  z
    .string({
      message: "Invalid type specified",
    })
    .min(1)
);

export const files = z
  .array(z.instanceof(File))
  .nullable()
  .refine(
    (files) =>
      !files ||
      files.every(
        (file) =>
          ACCEPTED_FILE_TYPES.includes(file.type) &&
          file.size <= MAX_POST_FILE_SIZE
      ),
    {
      message: "Invalid file type or size specified",
    }
  );
// export const files = zfd.repeatableOfType(zfd.file());

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

export const getOnePostSchema = z.object({
  postId,
});

export const uploadPostSchema = zfd.formData({
  content: content,
  files: files,
});

export const updatePostSchema = z.object({
  content: z
    .string({
      message: "Invalid type specified",
    })
    .min(1)
    .nullable(),
  files: z
    .array(z.instanceof(File))
    .max(5, {
      message: "You can upload up to 5 files",
    })
    .refine(
      (files) =>
        !files ||
        files.every(
          (file) =>
            ACCEPTED_FILE_TYPES.includes(file.type) &&
            file.size <= MAX_FILE_SIZE
        ),
      {
        message: "Invalid file type or size specified",
      }
    )
    .nullable(),
});
