"use server";

import { deleteEvent } from "@/db/data-access/events";
import { type ServerResponseMessage } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function removeEventAction(
  formData: FormData
): Promise<ServerResponseMessage> {
  const eventToRemove = formData.get("eventId") as string;
  const groupId = formData.get("groupId") as string;

  try {
    await deleteEvent({ eventId: eventToRemove });

    revalidatePath(`/groups/${groupId}`);

    return { message: "Event removed successfully", status: 200 };
  } catch (e) {
    return { message: "Failed to remove event", status: 500 };
  }
}
