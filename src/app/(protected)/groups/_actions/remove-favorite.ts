"use server";

import { removeUserFavoriteGroup } from "@/db/data-access/user";
import { ServerResponseMessage } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function removeFavoriteAction({
  groupId,
}: {
  groupId: string;
}): Promise<ServerResponseMessage> {
  try {
    await removeUserFavoriteGroup({ groupId });

    revalidatePath(`/dashboard`);
    revalidatePath(`/groups`);

    return {
      message: "Group removed from favorites",
      status: 200,
    };
  } catch (error) {
    return {
      message: "Failed to remove group from favorites",
      status: 500,
    };
  }
}
