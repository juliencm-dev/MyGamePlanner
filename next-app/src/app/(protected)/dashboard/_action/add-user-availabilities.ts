"use server";
import { type ServerResponseMessage } from "@/lib/types";
import { type UserAvailabilityDto } from "@/db/data-access/dto/users/types";

import { createUserAvailabilities } from "@/db/data-access/users";
import { revalidatePath } from "next/cache";

export async function addUserAvailabilitiesAction({ availabilities }: { availabilities: UserAvailabilityDto[] }): Promise<ServerResponseMessage> {
  try {
    await createUserAvailabilities(availabilities);

    revalidatePath("/dashboard");

    return { message: "Availabilities added successfully", status: 200 };
  } catch (error) {
    return {
      message: "Failed to add availabilities",
      status: 500,
    };
  }
}
