"use server";

import { createGame, updateGameImage } from "@/db/data-access/games";
import { type ServerResponseMessage } from "@/lib/types";
import { type GameDto } from "@/db/data-access/dto/games/types";
import { revalidatePath } from "next/cache";

export async function addGameAction(formData: FormData): Promise<ServerResponseMessage> {
  const newGame = {
    name: formData.get("name") as string,
    groupId: formData.get("groupId") as string,
    addedBy: formData.get("userId") as string,
    description: formData.get("description") as string,
    minPlayers: Number(formData.get("minPlayers")),
    maxPlayers: Number(formData.get("maxPlayers")),
    image: formData.get("image") as string,
  } as GameDto;

  try {
    const game: GameDto = await createGame({ newGame });

    if (!game) {
      return {
        message: "Failed to create game",
        status: 500,
      };
    }

    revalidatePath(`/groups/${game.groupId}`);

    return { message: "Game created successfully", status: 200 };
  } catch (error) {
    return {
      message: "Failed to create game",
      status: 500,
    };
  }
}
