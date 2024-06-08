import { getAll } from "./getAll";
import { getOne } from "./getOne";
import { create } from "./create";
import { update } from "./update";

const postService = {
  index: getAll,
  getOne: getOne,
  create: create,
  update: update,
};

export default postService;
