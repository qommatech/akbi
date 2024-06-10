interface Message {
  id: number;
  content: string | null;
  createdAt: Date;
}

export interface GetAllFriendsResponse {
  id: number;
  email: string;
  name: string;
  username: string;
  latestMessage: Message | null;
}
