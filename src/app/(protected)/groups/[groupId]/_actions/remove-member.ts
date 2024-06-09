"use server";
import { removeMemberFromGroup } from "@/data-access/group";
import { ServerResponseMessage } from "@/lib/types";
import { GroupMemberDto } from "@/use-case/groups/types";
import { revalidatePath } from "next/cache";

export async function removeMemberAction(
  groupMemberDto: GroupMemberDto
): Promise<ServerResponseMessage> {
  try {
    await removeMemberFromGroup(groupMemberDto.groupId, groupMemberDto.id);
    revalidatePath(`/groups/${groupMemberDto.groupId}`);
    return { message: "Member removed from group", status: 200 };
  } catch (error) {
    return { message: "Failed to remove member from group", status: 400 };
  }
}
