import { getOneUser } from "./getOneUser";
import { getMe } from "./getMe";
import { update } from "./update";
import { changeAvatar } from "./changeAvatar";

const userService = {
  getMe: getMe,
  getOneUser: getOneUser,
  update: update,
  changeAvatar: changeAvatar,
};

export default userService;
