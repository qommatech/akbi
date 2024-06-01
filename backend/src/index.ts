import { Hono } from "hono";
import { cors } from "hono/cors";

import { authRouter } from "./routes/authRoutes";

const app = new Hono();

app.use("*", cors());

app.route("/auth", authRouter);

const route = app.get("/", (c) => {
  return c.json({ message: "Hello, World!" });
});

export default app;
export type RouteType = typeof route;
