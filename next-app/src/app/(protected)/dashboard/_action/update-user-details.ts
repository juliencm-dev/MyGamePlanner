"use server";

import { UserDetails } from "@/db/data-access/dto/users/types";
import { updateUserDetails } from "@/db/data-access/users";
import { ServerResponseMessage } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function updateUserDetailsAction({ userDetails }: { userDetails: UserDetails }): Promise<ServerResponseMessage> {
  try {
    await updateUserDetails({ userDetails });
    return {
      message: "User details were succesfully updated",
      status: 200,
    } as ServerResponseMessage;
  } catch (error) {
    return {
      message: "User details could not be updated.",
      status: 500,
    } as ServerResponseMessage;
  }
}
