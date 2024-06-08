"use server";

import { createEvent } from "@/data-access/events";
import { ServerResponseMessage } from "@/lib/types";
import { EventConfirmationDto, EventDto } from "@/use-case/events/types";
import { GroupMemberDto } from "@/use-case/groups/types";
import { revalidatePath } from "next/cache";

export async function addEventAction({
  formData,
  startDate,
  endDate,
  members,
}: {
  formData: FormData;
  startDate: Date;
  endDate: Date;
  members: GroupMemberDto[];
}): Promise<ServerResponseMessage> {
  const newEvent = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    startDate: startDate,
    endDate: endDate,
    groupId: formData.get("groupId") as string,
    gameId: formData.get("gameId") as string,
    mandatoryPlayer: formData.get("mandatoryPlayer") as string | null,
  } as EventDto;

  const attendance: EventConfirmationDto[] = members.map((member) => {
    return {
      userId: member.id,
      eventId: newEvent.id,
    } as EventConfirmationDto;
  });

  try {
    const eventId = await createEvent({ newEvent, attendance });

    revalidatePath(`/groups/${newEvent.groupId}`);

    return { message: "Event created successfully", status: 200 };
  } catch (e) {
    return { message: "Failed to create event", status: 500 };
  }
}
