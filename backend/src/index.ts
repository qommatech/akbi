import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use("*", cors());

const route = app.get("/", (c) => {
    return c.json({ message: "Hello, World!" });
});

export default app;
export type RouteType = typeof route;
