import { Hono } from "hono";
import { cors } from "hono/cors";

import { websocketHandler, connectedClients } from "./websocket";

import { createBunWebSocket } from "hono/bun";

import { authRouter } from "./routes/authRoutes";

require("dotenv").config();

const { upgradeWebSocket, websocket } = createBunWebSocket();
const app = new Hono();

app.use("*", cors());

app.route("/auth", authRouter);

const route = app.get("/", (c) => {
  return c.json({ message: "Hello, World!" });
});
app.notFound((c) => {
  return c.text("Custom 404 Message", 404);
});
app.onError((err, c) => {
  console.error(`${err}`);
  return c.text(`${err}`, 500);
});

// Websocket
const server = Bun.serve(websocketHandler());
console.log(`Listening on ${server.hostname}:${server.port}`);

// Ensure server instance is available globally if needed
globalThis.serverInstance = server;

// Export connected clients to be accessible globally
globalThis.connectedClients = connectedClients;

// Start the server with the websocket handler

// Bun.serve<WebSocketData>({
//   async fetch(req, server) {
//     const token = req.headers.get("token");
//     const success = server.upgrade(req, {
//       data: {
//         token: token,
//       },
//     });
//     if (success) return undefined;

//     return new Response("WebSocket upgrade error", { status: 400 });
//   },
//   ...websocketHandler(),
// });
export default app;
export type RouteType = typeof route;
