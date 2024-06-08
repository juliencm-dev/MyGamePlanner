"use server";

import { addMemberToGroup } from "@/data-access/group";

export async function addMemberToGroupAction(groupId: string, userId: string) {
  try {
    await addMemberToGroup(groupId, userId);
  } catch (error) {
    console.error("Failed to join group");
    return { message: "Failed to join group", status: 400 };
  }
  return { message: "Group joined successfully", status: 201 };
}
