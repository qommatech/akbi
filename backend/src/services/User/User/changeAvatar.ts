import { Context } from "hono";
import s3Service from "../../s3Service";
import { UserRepository } from "../../../repositories/userRepository";

export const changeAvatar = async (c: Context): Promise<boolean> => {
  const { avatar } = c.req.valid("form" as never) as { avatar: File };
  const payload = c.get("jwtPayload");
  const username = payload.username;
  const userId = payload.id;

  try {
    const arrBuffer = await avatar.arrayBuffer();
    const buffer = Buffer.from(arrBuffer);

    const filename = `avatar/${username}.png`;

    const profilePictureUrl = await s3Service.uploadFile(buffer, filename);

    await UserRepository.changeAvatar(userId, profilePictureUrl);
    return true;
  } catch (error) {
    console.log("Error uploading avatar", error);
    throw new Error("Error uploading avatar");
  }
};
