import { FriendRepository } from "../repositories/friendRepository";
import { UserRepository } from "../repositories/userRepository";

export const userService = {
  getOneUserWithPosts: async (
    userId: number,
    otherUserId: number
  ): Promise<any> => {
    try {
      const result = await FriendRepository.getOneUserWithPosts(
        userId,
        otherUserId
      );
      return result;
    } catch (error) {
      console.error("Error fetching user and posts: ", error);
      return { error: "Error fetching user and posts" };
    }
  },

  updateUser: async (
    userId: number,
    email: string,
    name: string,
    username: string
  ): Promise<{ message: string } | { error: string }> => {
    try {
      await UserRepository.updateUser(userId, email, name, username);
      return { message: "User updated successfully" };
    } catch (error) {
      console.log("Error updating user: ", error);
      return { error: "Error updating user" };
    }
  },

  changeAvatar: async (
    userId: number,
    profilePictureUrl: string
  ): Promise<{ message: string } | { error: string }> => {
    try {
      await UserRepository.changeAvatar(userId, profilePictureUrl);
      return { message: "Avatar updated successfully" };
    } catch (error) {
      console.log("Error updating avatar: ", error);
      return { error: "Error updating avatar" };
    }
  },
};
