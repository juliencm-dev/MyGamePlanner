"use server";

import {
  addUserFavoriteGroup,
  getUserFavoriteGroups,
} from "@/db/data-access/user";
import { type ServerResponseMessage } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function addFavoriteAction({
  groupId,
}: {
  groupId: string;
}): Promise<ServerResponseMessage> {
  try {
    const favorites = await getUserFavoriteGroups();

    if (favorites?.length > 3)
      return {
        message: "You can only have 4 favorite groups",
        status: 500,
      };

    await addUserFavoriteGroup({ groupId });

    revalidatePath(`/dashboard`);
    revalidatePath(`/groups`);

    return {
      message: "Group added to favorites",
      status: 200,
    };
  } catch (error) {
    return {
      message: "Failed to add group to favorites",
      status: 500,
    };
  }
}
