import { Hono } from "hono";
import { AuthService } from "../services/authService";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "../utils/schemas";

export const authRouter = new Hono()

    .post(
        "/register",
        zValidator("json", registerSchema, (result, c) => {
            if (!result.success) {
                return c.json(
                    {
                        error: result.error.flatten().fieldErrors,
                    },
                    400
                );
            }
        }),
        async (c) => {
            const { email, name, username, password } = c.req.valid("json");

            const result = await AuthService.register(
                email,
                name,
                username,
                password
            );

            if ("token" in result) {
                return c.json({ token: result.token }, 201);
            } else {
                return c.json({ error: result.error }, 400);
            }
        }
    )

    .post(
        "/login",
        zValidator("json", loginSchema, (result, c) => {
            if (!result.success) {
                return c.json(
                    {
                        error: result.error.flatten().fieldErrors,
                    },
                    400
                );
            }
        }),
        async (c) => {
            const { username, password } = c.req.valid("json");
            const result = await AuthService.login(username, password);
            if (result) {
                return c.json({ token: result });
            } else {
                return c.json({ error: "Invalid credentials" }, 401);
            }
        }
    );
