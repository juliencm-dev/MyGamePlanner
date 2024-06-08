"use server";

import { updateMemberRole } from "@/data-access/group";
import { ServerResponseMessage } from "@/lib/types";
import { UpdateMemberDto } from "@/use-case/groups/types";
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
