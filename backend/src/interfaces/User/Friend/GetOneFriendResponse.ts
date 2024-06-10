import { Post } from "@prisma/client";

export interface GetOneFriendResponse {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  posts?: Post[];
}
