// src/routes/authRoutes.ts
import { Hono } from "hono";
import { AuthService } from "../services/authService";

const authRouter = new Hono();

authRouter.post("/register", async (c) => {
  const { email, name, username, password } = await c.req.json();
  const result = await AuthService.register(email, name, username, password);
  if ("token" in result) {
    return c.json({ token: result.token }, 201);
  } else {
    return c.json({ error: result.error }, 400);
  }
});

authRouter.post("/login", async (c) => {
  const { username, password } = await c.req.json();
  const result = await AuthService.login(username, password);
  if (result) {
    return c.json({ token: result });
  } else {
    return c.json({ error: "Invalid credentials" }, 401);
  }
});

export { authRouter };
