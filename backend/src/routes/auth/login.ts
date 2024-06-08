import { Hono } from "hono";
import { authRoute } from ".";

export const loginRoute = new Hono().get("/login/test", async (c) => {
  return c.json("akmal ganteng");
});
