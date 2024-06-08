import { useMutation } from "react-query";
import { client } from "../client";
import { InferRequestType } from "hono/client";

const $post = client.auth.login.$post;

export const useLogin = () =>
    useMutation({
        mutationFn: async (json: InferRequestType<typeof $post>["json"]) => {
            return $post({
                json: json,
            });
        },
    });
