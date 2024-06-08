export type GameDto = {
  id: string;
  name: string;
  groupId: string;
  description?: string;
  minPlayers: number;
  maxPlayers: number;
  image?: string;
  addedBy: string;
};

export type RatingDto = {
  gameId: string;
  userId: string;
  rating: number;
};
