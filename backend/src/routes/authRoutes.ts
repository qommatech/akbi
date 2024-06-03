// src/routes/authRoutes.ts
import { Hono } from "hono";
import { AuthService } from "../services/authService";
import { z } from "zod";

const authRouter = new Hono();

// Schema for registration
const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().max(50),
  username: z.string().max(10).toLowerCase(),
  password: z.string().max(15),
});

// Schema for login
const loginSchema = z.object({
  username: z.string().max(10).min(6),
  password: z.string().max(15).min(6),
});

authRouter.post("/register", async (c) => {
  const validation = registerSchema.safeParse(await c.req.json());

  if (!validation.success) {
    return c.json(
      { error: "Invalid input", details: validation.error.flatten() },
      400
    );
  }

  const { email, name, username, password } = validation.data;

  const result = await AuthService.register(email, name, username, password);
  if ("token" in result) {
    return c.json({ token: result.token }, 201);
  } else {
    return c.json({ error: result.error }, 400);
  }
});

authRouter.post("/login", async (c) => {
  const validation = loginSchema.safeParse(await c.req.json());

  if (!validation.success) {
    return c.json(
      { error: "Invalid input", details: validation.error.flatten() },
      400
    );
  }

  const { username, password } = validation.data;
  const result = await AuthService.login(username, password);
  if (result) {
    return c.json({ token: result });
  } else {
    return c.json({ error: "Invalid credentials" }, 401);
  }
});

export { authRouter };
