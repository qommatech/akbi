import { Hono } from "hono";
import { cors } from "hono/cors";
import { poweredBy } from "hono/powered-by";
import { logger } from "hono/logger";
import { decode, jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";

import { authRouter } from "./routes/authRoutes";
import { friendRouter } from "./routes/friendRoutes";
import { userRouter } from "./routes/userRoutes";
import { storyRouter } from "./routes/storyRoutes";
import { postRouter } from "./routes/postRoutes";
import { JWTPayload } from "hono/utils/jwt/types";
import { websocket, connectedClients, WebSocketData } from "./ws";

type Variables = JwtVariables;

const api = new Hono<{ Variables: Variables }>()
    .get("/", async (c) => {
        return c.json("Welcome to the API");
    })
    .basePath("/api")
    .use(
        "*",
        jwt({
            secret: process.env.SECRET_KEY as string,
        })
    )
    .route("/friend", friendRouter)
    .route("/user", userRouter)
    .route("/story", storyRouter)
    .route("/post", postRouter);

const app = new Hono()
    .use("*", cors())
    .use(poweredBy())
    .use(logger())
    .route("/auth", authRouter)
    .route("/", api)
    .notFound((c) => {
        return c.json({ error: "Not Found" }, 404);
    })
    .onError((err, c) => {
        console.error(`${err}`);
        return c.json({ error: err.message }, 500);
    });

export interface ServerData {
    authToken: string;
}

const server = Bun.serve<ServerData>({
    fetch: (req, server) => {
        const token = req.headers.get("token");

        if (!token) {
            return app.fetch(req);
        }

        const { payload } = decode(token);

        const { id } = payload as JWTPayload & {
            id: number;
        };
        const otherUserId = parseInt(req.headers.get("otherUserId") as string);

        if (
            server.upgrade(req, {
                data: {
                    authToken: token,
                    userId: id,
                    otherUserId: otherUserId,
                },
            })
        ) {
            return;
        }

        return app.fetch(req);
    },
    websocket: websocket,
});
console.log(`Server listening on ${server.hostname}:${server.port}`);

globalThis.serverInstance = server;
globalThis.connectedClients = connectedClients;
