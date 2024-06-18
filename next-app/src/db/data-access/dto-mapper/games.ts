import { type Game, type GameRating } from "@/db/schema";
import { type GameDto, type RatingDto } from "@/db/data-access/dto/games/types";

export function toGameDtoMapper(games: Game[]): GameDto[] {
  return games.map(game => {
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
  return ratings.map(rating => {
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
