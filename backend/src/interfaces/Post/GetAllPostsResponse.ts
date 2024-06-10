import { AssetType } from "@prisma/client";
import { Reaction } from "@prisma/client";

type ReactionCounts = {
  [key in Reaction]: number;
};

interface User {
  username: string;
  profilePictureUrl: string | null;
}

interface PostAsset {
  id: number;
  url: string;
  type: AssetType;
}

interface ReactionCountEntry {
  [reaction: string]: number;
}

export interface GetAllPostsResponse {
  id: number;
  author: User;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  reactions: Partial<ReactionCounts>;
  postAsset: PostAsset[] | [];
}
