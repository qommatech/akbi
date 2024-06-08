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

/**
 * Schemas
 */

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
