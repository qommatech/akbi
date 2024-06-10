interface Friend {
  id: number;
  username: string;
  email: string;
  profilePictureUrl: string | null;
}

// Define the structure for a FriendUserFriends object
interface FriendUserFriends {
  friend: Friend;
}

// Define the structure for a Post object
interface Post {
  id: number;
  content: string;
  createdAt: Date;
}

// Define the structure for a Story object
interface Story {
  id: number;
  content: string;
  createdAt: Date;
  // Add other fields if necessary
}

export interface GetMeResponse {
  email: string;
  username: string;
  name: string;
  profilePictureUrl: string | null;
  friends: Friend[];
  posts?: Post[];
  stories?: Story[];
}
