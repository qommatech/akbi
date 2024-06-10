import { hc } from "hono/client";
import { AppType } from "@akbi/backend/src";

export const client = hc<AppType>(import.meta.env.VITE_API_ENDPOINT);
