"use server";

import { addGameRating } from "@/db/data-access/games";
import { ServerResponseMessage } from "@/lib/types";
import { type RatingDto } from "@/db/data-access/dto/games/types";

export async function addGameRatingAction(
  rating: RatingDto
): Promise<ServerResponseMessage> {
  try {
    await addGameRating(rating);
    return { message: "Game rating added successfully", status: 200 };
  } catch (e) {
    return { message: "You have already rated this game", status: 500 };
  }
}
