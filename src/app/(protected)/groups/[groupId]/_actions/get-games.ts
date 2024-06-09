import { getGamesByGroupId } from "@/db/data-access/games";
import { type GameDto } from "@/db/data-access/dto/games/types";

export async function getGamesAction({
  groupId,
}: {
  groupId: string;
}): Promise<GameDto[] | { message: string; status: number }> {
  try {
    const games = await getGamesByGroupId({ groupId });
    return games;
  } catch (e) {
    return { message: "There was no game found with this id", status: 500 };
  }
}
