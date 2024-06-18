"use server";

import { updateUserAvatar } from "@/db/data-access/users";
import { ServerResponseMessage } from "@/lib/types";

export async function updateUserAvatarAction(url: string): Promise<ServerResponseMessage> {
  try {
    await updateUserAvatar({
      avatarKey: url,
    });

    return {
      message: "Avatar updated successfully",
      status: 200,
    } as ServerResponseMessage;
  } catch (error) {
    return {
      message: "Something went wrong. Could not update avatar.",
      status: 500,
    } as ServerResponseMessage;
  }
}
