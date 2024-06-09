"use server";
import { removeMemberFromGroup } from "@/data-access/group";
import { ServerResponseMessage } from "@/lib/types";
import { GroupMemberDto } from "@/use-case/groups/types";
import { revalidatePath } from "next/cache";

export async function removeMemberAction(
  groupMemberDto: GroupMemberDto
): Promise<ServerResponseMessage> {
  const res = await removeMemberFromGroup(
    groupMemberDto.groupId,
    groupMemberDto.id
  );

  if (!res) {
    return { message: "Failed to remove member from group", status: 400 };
  }

  revalidatePath(`/groups/${groupMemberDto.groupId}`);

  return { message: "Member removed from group", status: 200 };
}
