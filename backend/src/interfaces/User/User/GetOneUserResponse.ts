interface Post {
  id: number;
  content: string;
  createdAt: Date;
}

interface Story {
  id: number;
  content: string;
  createdAt: Date;
}

export interface GetOneUserResponse {
  email: string;
  username: string;
  name: string;
  profilePictureUrl?: string | null;
  posts: Post[];
  stories: Story[];
  isFriends: boolean;
}
