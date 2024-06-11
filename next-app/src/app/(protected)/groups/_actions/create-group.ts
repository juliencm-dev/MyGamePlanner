"use server";

import { auth } from "@/auth";
import { createGroup } from "@/db/data-access/groups";
import { type ServerResponseMessage } from "@/lib/types";
import { type GroupDto } from "@/db/data-access/dto/groups/types";
import { revalidatePath } from "next/cache";

export async function createGroupeAction(
  formData: FormData
): Promise<ServerResponseMessage> {
  const { getUser } = await auth();
  const user = getUser();

  if (!user) throw new Error("User not authenticated");

  const userId = user.id;

  const newGroup: GroupDto = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    ownerId: userId,
    isFavourite: false,
  };

  try {
    await createGroup(newGroup);
    revalidatePath("/groups");
    return { message: "Group created successfully", status: 200 };
  } catch (e) {
    return { message: "Failed to create group", status: 500 };
  }
}
