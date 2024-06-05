import { Hono } from "hono";
import { cors } from "hono/cors";
import { poweredBy } from "hono/powered-by";
import { logger } from "hono/logger";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";

import { websocketHandler, connectedClients } from "./websocket";

import { authRouter } from "./routes/authRoutes";
import { friendRouter } from "./routes/friendRoutes";
import { userRouter } from "./routes/userRoutes";
import { storyRouter } from "./routes/storyRoutes";
import { postRouter } from "./routes/postRoutes";

require("dotenv").config();

type Variables = JwtVariables;

const app = new Hono();

// Websocket
const server = Bun.serve(websocketHandler());
console.log(`Websocket Listening on ${server.hostname}:${server.port}`);

// Ensure server instance is available globally if needed
globalThis.serverInstance = server;

// Export connected clients to be accessible globally
globalThis.connectedClients = connectedClients;

app.use("*", cors());
app.use(poweredBy());
app.use(logger());

app.route("/auth", authRouter);

const api = new Hono<{ Variables: Variables }>().basePath("/api");
api.use(
  "*",
  jwt({
    secret: process.env.SECRET_KEY as string,
  })
);

api.route("/friend", friendRouter);
api.route("/user", userRouter);
api.route("/story", storyRouter);
api.route("/post", postRouter);

const route = app.get("/", (c) => {
  return c.json({ message: "Hello, This is AKBI endpoint" });
});

app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ error: err.message }, 500);
});

app.route("/", api);

// export default app;
export default app;
export type RouteType = typeof route;
