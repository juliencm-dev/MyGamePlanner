"use server";

import { createUserAvailabilities } from "@/data-access/user";
import { ServerResponseMessage } from "@/lib/types";
import { UserAvailabilityDto } from "@/use-case/users/types";
import { revalidatePath } from "next/cache";

export async function addUserAvailabilitiesAction({
  availabilities,
}: {
  availabilities: UserAvailabilityDto[];
}): Promise<ServerResponseMessage> {
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
