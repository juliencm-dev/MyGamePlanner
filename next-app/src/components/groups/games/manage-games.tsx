"use client";

import { Button } from "@/components/ui/button";
import { Selector } from "@/components/selector";
import { AddGame } from "@/components/groups/games/add-game";
import { RateGame } from "@/components/groups/games/rate-game";

import { useState } from "react";
import { RemoveGame } from "@/components/groups/games/remove-game";
import { type GroupDataProps, useGroup } from "@/context/group-context";

export function ManageGames() {
  const { games, isAdmin, loggedInUser } = useGroup() as GroupDataProps;
  const [selectedGameId, setSelectedGameId] = useState<string>("");
  const [selectedGameName, setSelectedGameName] = useState<string>("");

  return (
    <fieldset className='flex flex-col gap-2 border p-4 rounded-lg justify-around'>
      <legend className='text-lg px-1'>Games</legend>
      <Selector
        placeholder={["Available games list", "games"]}
        data={games}
        selectedId={selectedGameId}
        setSelectedId={setSelectedGameId}
        setSelectedName={setSelectedGameName}
      />
      <div className='flex flex-col w-full gap-2'>
        <RateGame
          userId={loggedInUser.id}
          selectedGame={{
            id: selectedGameId,
            name: selectedGameName,
            image: games.find((g) => g.id === selectedGameId)?.image,
          }}>
          <Button
            variant={"secondary"}
            disabled={!selectedGameId}
            className='text-sm'>
            Rate Game
          </Button>
        </RateGame>
        {isAdmin &&
          renderAddRemoveGameButton({
            selectedGameId,
            setSelectedGameId,
            setSelectedGameName,
          })}
      </div>
    </fieldset>
  );
}

function renderAddRemoveGameButton({
  selectedGameId,

  setSelectedGameId,
  setSelectedGameName,
}: {
  selectedGameId: string;
  setSelectedGameId: (value: string) => void;
  setSelectedGameName: (value: string) => void;
}) {
  if (selectedGameId === "") {
    return (
      <AddGame>
        <Button className='text-sm'> Add Game</Button>
      </AddGame>
    );
  } else {
    return (
      <RemoveGame
        gameId={selectedGameId}
        setSelectedGameId={setSelectedGameId}
        setSelectedGameName={setSelectedGameName}
      />
    );
  }
}
