"use server";

import { addGameRating } from "@/data-access/games";
import { ServerResponseMessage } from "@/lib/types";
import { RatingDto } from "@/use-case/games/types";

export async function addGameRatingAction(
  rating: RatingDto
): Promise<ServerResponseMessage> {
  const res = await addGameRating(rating);
  if (!res) {
    return { message: "Failed to add rating to game", status: 500 };
  }

  return { message: "Game rating added successfully", status: 200 };
}
