"use server";

import { updateMemberRole } from "@/db/data-access/groups";
import { type ServerResponseMessage } from "@/lib/types";
import { type UpdateMemberDto } from "@/db/data-access/dto/groups/types";
import { revalidatePath } from "next/cache";

export async function updateMemberRoleAction(
  member: UpdateMemberDto
): Promise<ServerResponseMessage> {
  const res = await updateMemberRole(member);

  if (!res) {
    return { message: "Failed to update member role", status: 500 };
  }

  revalidatePath(`/groups/${member.groupId}`);

  return { message: "Member role updated successfully", status: 200 };
}
