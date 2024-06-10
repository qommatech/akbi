import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "../utils/schemas";
import authService from "../services/Auth";

export const authRouter = new Hono()

  .post(
    "/register",
    zValidator("json", registerSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            error: result.error.flatten().fieldErrors,
          },
          400
        );
      }
    }),
    async (c) => {
      const { email, name, username, password } = c.req.valid("json");

      const result = await authService.register(
        email,
        name,
        username,
        password
      );

      if ("token" in result) {
        return c.json(result, 201);
      }
      throw new Error("Error registering");
    }
  )

  .post(
    "/login",
    zValidator("json", loginSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            error: result.error.flatten().fieldErrors,
          },
          400
        );
      }
    }),
    async (c) => {
      const { username, password } = c.req.valid("json");
      const result = await authService.login(username, password);
      if (result) {
        return c.json(result);
      }
      throw new Error("Unauthenticated");
    }
  );
