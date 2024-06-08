"use server";

import { createGame, updateGameImage } from "@/data-access/games";
import { S3AllowedContentTypes, addImageToBucket } from "@/db/s3";
import { Game } from "@/db/schema";
import { processImageFile } from "@/lib/img-processing";
import { ServerResponseMessage } from "@/lib/types";
import { GameDto } from "@/use-case/games/types";
import { revalidatePath } from "next/cache";

export async function addGameAction(
  formData: FormData
): Promise<ServerResponseMessage> {
  const imgFile: File = formData.get("image") as File;
  const fileContentType: string = imgFile.type;

  if (
    !["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(
      fileContentType
    )
  ) {
    return {
      message: "Invalid image type",
      status: 400,
    };
  }

  const imgBuffer = await processImageFile({
    file: imgFile,
    height: 200,
  });

  const newGame = {
    name: formData.get("name") as string,
    groupId: formData.get("groupId") as string,
    addedBy: formData.get("userId") as string,
    description: formData.get("description") as string,
    minPlayers: Number(formData.get("minPlayers")),
    maxPlayers: Number(formData.get("maxPlayers")),
  } as GameDto;

  try {
    const game: GameDto = await createGame({ newGame });

    if (!game) {
      return {
        message: "Failed to create game",
        status: 500,
      };
    }

    await addImageToBucket({
      key: game.id,
      image: imgBuffer,
      contentType: fileContentType as S3AllowedContentTypes,
    });

    await updateGameImage({ gameId: game.id, imageUrl: game.id });

    revalidatePath(`/groups/${game.groupId}`);

    return { message: "Game created successfully", status: 200 };
  } catch (error) {
    return {
      message: "Failed to create game",
      status: 500,
    };
  }
}
