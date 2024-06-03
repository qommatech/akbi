import { FriendRepository } from "../repositories/friendRepository";
import { FriendRequestStatus, FriendRequest } from "@prisma/client";

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

  sendFriendRequest: async (senderId: number, receiverId: number) => {
    try {
      const friendRequest = await FriendRepository.sendFriendRequest(
        senderId,
        receiverId
      );
      return friendRequest;
    } catch (error) {
      console.error("Error sending friend request:", error);
      return { error: "Error sending friend request" };
    }
  },

  acceptFriendRequest: async (userId: number, otherUserId: number) => {
    try {
      const friendRequest = await FriendRepository.getFriendRequest(
        userId,
        otherUserId
      );
      if (!friendRequest) {
        return { error: "Friend request not found" };
      }

      await FriendRepository.updateFriendRequestStatus(
        friendRequest.id,
        FriendRequestStatus.ACCEPTED
      );

      await FriendRepository.createFriendship(
        friendRequest.senderId,
        friendRequest.receiverId
      );

      return { message: "Friend request accepted" };
    } catch (error) {
      console.error("Error accepting friend request:", error);
      return { error: "Error accepting friend request" };
    }
  },

  rejectFriendRequest: async (userId: number, otherUserId: number) => {
    try {
      const friendRequest = await FriendRepository.getFriendRequest(
        userId,
        otherUserId
      );
      if (!friendRequest) {
        return { error: "Friend request not found" };
      }

      await FriendRepository.updateFriendRequestStatus(
        friendRequest.id,
        FriendRequestStatus.REJECTED
      );
      return { message: "Friend request rejected" };
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      return { error: "Error rejecting friend request" };
    }
  },

  getAllFriendRequests: async (
    userId: number
  ): Promise<{ friendRequests: FriendRequest[] } | { error: string }> => {
    try {
      const { friendRequests } =
        await FriendRepository.getAllFriendRequests(userId);
      return { friendRequests };
    } catch (error) {
      console.log("Error fetching all friend requests: ", error);
      return { error: "Error fetching all friend requests" };
    }
  },
};
