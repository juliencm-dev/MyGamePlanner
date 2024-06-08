import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import {
  Game,
  GameRating,
  groupAvailableGames,
  groupGameRating,
} from "@/db/schema";
import { GameDto, RatingDto } from "@/use-case/games/types";
import { getImageFromBucket } from "@/db/s3";

export function toGameDtoMapper(games: Game[]): GameDto[] {
  return games.map((game) => {
    return {
      id: game.id,
      name: game.name,
      groupId: game.groupId,
      minPlayers: game.minPlayers,
      maxPlayers: game.maxPlayers,
      description: game.description,
      image: game.image,
      addedBy: game.addedBy,
    } as GameDto;
  });
}

export function toGameMapper(game: GameDto): Game {
  return {
    id: game.id,
    name: game.name,
    groupId: game.groupId,
    minPlayers: game.minPlayers,
    maxPlayers: game.maxPlayers,
    description: game.description,
    image: game.image,
    addedBy: game.addedBy,
  } as Game;
}

export function toGameRatingDtoMapper(ratings: GameRating[]): RatingDto[] {
  return ratings.map((rating) => {
    return {
      gameId: rating.gameId,
      userId: rating.userId,
      rating: rating.rating,
    } as RatingDto;
  });
}

export function toGameRatingMapper(rating: RatingDto): GameRating {
  return {
    gameId: rating.gameId,
    userId: rating.userId,
    rating: rating.rating,
  } as GameRating;
}

export async function createGame({ newGame }: { newGame: GameDto }) {
  const game = toGameMapper(newGame);
  try {
    const newGame = (await db
      .insert(groupAvailableGames)
      .values(game)
      .returning()) as Game[];
    return toGameDtoMapper(newGame)[0];
  } catch (error) {
    throw new Error("Could not create game");
  }
}

export async function deleteGame({ gameId }: { gameId: string }) {
  return await db
    .delete(groupAvailableGames)
    .where(eq(groupAvailableGames.id, gameId));
}

export async function updateGameImage({
  gameId,
  imageUrl,
}: {
  gameId: string;
  imageUrl: string;
}) {
  try {
    await db
      .update(groupAvailableGames)
      .set({ image: imageUrl })
      .where(eq(groupAvailableGames.id, gameId));
  } catch (error) {
    throw new Error("Could not update game image");
  }
}

export async function addGameRating(rating: RatingDto) {
  const newRating: GameRating = toGameRatingMapper(rating);
  return await db.insert(groupGameRating).values(newRating).returning();
}

export async function getGameById({
  gameId,
}: {
  gameId: string;
}): Promise<GameDto> {
  try {
    const foundGame = await db.query.groupAvailableGames.findFirst({
      where: eq(groupAvailableGames.id, gameId),
    });

    if (!foundGame) {
      throw new Error("Could not find game");
    }

    if (foundGame.image) {
      foundGame.image = await getImageFromBucket({ key: foundGame.image });
    }

    return toGameDtoMapper([foundGame])[0];
  } catch (error) {
    throw new Error("Could not find game");
  }
}

export async function getGamesByGroupId({
  groupId,
}: {
  groupId: string;
}): Promise<GameDto[]> {
  try {
    const foundGames = await db.query.groupAvailableGames.findMany({
      where: eq(groupAvailableGames.groupId, groupId),
    });

    const foundGamesPromises = foundGames.map(async (game) => {
      if (game.image) {
        game.image = await getImageFromBucket({ key: game.image });
        return game;
      }
    });

    const foundGamesMappedImages = (await Promise.all(
      foundGamesPromises
    )) as Game[];

    return toGameDtoMapper(foundGamesMappedImages);
  } catch (error) {
    throw new Error("Could not find games");
  }
}

export async function getGameRatingsByGameId({
  gameId,
}: {
  gameId: string;
}): Promise<RatingDto[]> {
  const foundRatings = await db.query.groupGameRating.findMany({
    where: eq(groupGameRating.gameId, gameId),
  });

  return toGameRatingDtoMapper(foundRatings);
}
