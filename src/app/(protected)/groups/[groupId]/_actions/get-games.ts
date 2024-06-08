import { getGamesByGroupId } from "@/data-access/games";
import { GameDto } from "@/use-case/games/types";

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
