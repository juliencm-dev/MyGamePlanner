"use client";

import { Button } from "@/components/ui/button";
import { Selector } from "@/components/selector";
import { useState } from "react";
import { type GroupMemberDto } from "@/db/data-access/dto/groups/types";
import { AddEvent } from "@/components/groups/events/add-event";
import { RemoveEvent } from "@/components/groups/events/remove-event";
import { type GameDto } from "@/db/data-access/dto/games/types";
import { type GroupDataProps, useGroup } from "@/context/group-context";

export function ManageEvents() {
  const { members, games, events, isAdmin, group } =
    useGroup() as GroupDataProps;

  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedEventName, setSelectedEventName] = useState<string>("");

  return (
    <fieldset className='flex flex-col gap-2 border p-4 rounded-lg justify-around'>
      <legend className='text-lg px-1'>Events</legend>
      <Selector
        placeholder={["Events list", "events"]}
        data={events}
        selectedId={selectedEventId}
        setSelectedId={setSelectedEventId}
        setSelectedName={setSelectedEventName}
      />
      <div className='flex flex-col gap-2 w-full'>
        <Button
          variant={"secondary"}
          className='text-sm'
          disabled={!selectedEventId}>
          Edit Event
        </Button>
        {isAdmin &&
          renderAddRemoveEventButton({
            selectedEventId,
            groupId: group.id as string,
            members,
            games,
            setSelectedEventId,
            setSelectedEventName,
          })}
      </div>
    </fieldset>
  );
}

function renderAddRemoveEventButton({
  selectedEventId,
  setSelectedEventId,
  setSelectedEventName,
}: {
  selectedEventId: string;
  groupId: string;
  members: GroupMemberDto[];
  games: GameDto[];
  setSelectedEventId: (value: string) => void;
  setSelectedEventName: (value: string) => void;
}) {
  console.log(selectedEventId);

  if (selectedEventId === "") {
    return (
      <AddEvent>
        <Button className='text-sm'> Add Event</Button>
      </AddEvent>
    );
  } else {
    return (
      <RemoveEvent
        eventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
        setSelectedEventName={setSelectedEventName}
      />
    );
  }
}
