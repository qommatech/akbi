import { FriendRequestStatus } from "@prisma/client";

interface SanitizedUser {
  profilePictureUrl?: string | null;
  email: string;
  name: string;
  username: string;
}

export interface getAllFriendRequestsResponse {
  id: number;
  senderId: number;
  status: FriendRequestStatus;
  createdAt: Date;
  sender: SanitizedUser;
}
