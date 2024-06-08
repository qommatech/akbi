import { hc } from "hono/client";
import { AppType } from "@akbi/backend/src";

export const client = hc<AppType>("https://api.akbi.qomma.tech/");
