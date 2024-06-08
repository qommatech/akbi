import { Hono } from "hono";
import { loginRoute } from "./login";

export const authRoute = new Hono().route("/login", loginRoute);
