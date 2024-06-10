import { getAll } from "./getAll";
import { getAllFriendRequests } from "./getAllFriendRequests";
import { respondFriendRequest } from "./respondFriendRequest";
import { sendFriendRequest } from "./sendFriendRequest";

const friendService = {
  getAll: getAll,
  getAllFriendRequests: getAllFriendRequests,
  sendFriendRequest: sendFriendRequest,
  respondFriendRequest: respondFriendRequest,
};

export default friendService;
