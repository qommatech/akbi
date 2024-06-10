import { User } from "@prisma/client";

export interface LoginResponse extends Omit<User, "password"> {
  _count: {
    posts: number;
    userFriends: number;
  };
}
