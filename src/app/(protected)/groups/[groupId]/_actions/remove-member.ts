"use server";
import { removeMemberFromGroup } from "@/db/data-access/groups";
import { ServerResponseMessage } from "@/lib/types";
import { type GroupMemberDto } from "@/db/data-access/dto/groups/types";
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
