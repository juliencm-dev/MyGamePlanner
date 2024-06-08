"use server";

import { deleteGame } from "@/data-access/games";
import { ServerResponseMessage } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function removeGameAction(
  formData: FormData
): Promise<ServerResponseMessage> {
  const gameToRemove = formData.get("gameId") as string;

  const res = await deleteGame({ gameId: gameToRemove });

  if (!res) {
    return { message: "Failed to remove game", status: 500 };
  }

  revalidatePath(`/groups/${gameToRemove}`);

  return { message: "Game removed successfully", status: 200 };
}
