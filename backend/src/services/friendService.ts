import { FriendRepository } from "../repositories/friendRepository";

export const FriendService = {
  index: async (
    userId: number
  ): Promise<{ friends: any[] } | { error: string }> => {
    try {
      const friends = await FriendRepository.getAllFriends(userId);
      return { friends };
    } catch (error) {
      console.log("Error fetching friends: ", error);
      return { error: "Error fetching friends" };
    }
  },
};
