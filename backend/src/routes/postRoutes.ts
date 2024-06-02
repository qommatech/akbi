import { Hono } from "hono";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";

type Variables = JwtVariables;

const postRouter = new Hono<{ Variables: Variables }>();

postRouter.use(
  "/post/*",
  jwt({
    secret: process.env.SECRET_KEY as string,
  })
);

postRouter.get("/post", async (c) => {});
