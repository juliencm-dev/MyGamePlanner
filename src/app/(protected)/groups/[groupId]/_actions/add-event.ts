"use server";

import { NotificationProps } from "@/components/groups/join/add-member-button";
import { createEvent } from "@/data-access/events";
import { ServerResponseMessage } from "@/lib/types";
import { EventConfirmationDto, EventDto } from "@/use-case/events/types";
import { GroupMemberDto } from "@/use-case/groups/types";
import { UserDto } from "@/use-case/users/types";
import { revalidatePath } from "next/cache";

export async function addEventAction({
  formData,
  startDate,
  endDate,
  members,
  user,
}: {
  formData: FormData;
  startDate: Date;
  endDate: Date;
  members: GroupMemberDto[];
  user: UserDto;
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
    await createEvent({ newEvent, attendance });

    revalidatePath(`/groups/${newEvent.groupId}`);

    const receiverIds = members.map((member) => member.id);

    return {
      message: "Event created successfully",
      notification: {
        message: `${user.name} has created a new event : ${newEvent.name}`,
        sender: user.id,
        receivers: receiverIds,
        target: newEvent.groupId,
      } as NotificationProps,
      status: 200,
    };
  } catch (e) {
    return { message: "Failed to create event", status: 500 };
  }
}
