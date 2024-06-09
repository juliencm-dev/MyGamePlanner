"use server";

import { updateUserAttendance } from "@/db/data-access/events";
import { type ServerResponseMessage } from "@/lib/types";
import { type EventConfirmationDto } from "@/db/data-access/dto/events/types";
import { revalidatePath } from "next/cache";

export async function updateUserAttendanceAction({
  userAttendanceDto,
  groupId,
}: {
  userAttendanceDto: EventConfirmationDto;
  groupId: string;
}): Promise<ServerResponseMessage> {
  try {
    await updateUserAttendance(userAttendanceDto);

    revalidatePath(`/groups/${groupId}`);

    return { message: "User attendance updated successfully", status: 200 };
  } catch (error) {
    return {
      message: "Failed to update user attendance",
      status: 500,
    };
  }
}
