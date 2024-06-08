"use server";

import { updateUserAttendance } from "@/data-access/events";
import { ServerResponseMessage } from "@/lib/types";
import { EventConfirmationDto } from "@/use-case/events/types";
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
