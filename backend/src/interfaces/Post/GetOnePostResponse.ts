import { AssetType } from "@prisma/client";

// Define the Reaction type, assuming it is a string enum
type Reaction = "LOVE" | "FIRE" | "ROCKET" | "SHOCKED";

// Define the interface for a user
interface User {
  username: string;
  profilePictureUrl: string | null;
}

// Define the interface for a post asset
interface PostAsset {
  url: string;
  type: AssetType;
}

// Define the interface for a single reaction count entry
interface ReactionCountEntry {
  count: number;
  users: User[];
}

// Define the interface for the response
export interface GetOnePostResponse {
  id: number;
  postAsset: PostAsset[] | []; // Adjusted for cases where postAsset might be null
  author: User;
  content: string;
  createdAt: Date;
  reactions: Partial<Record<Reaction, ReactionCountEntry>>;
}
