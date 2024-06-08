"use server";
import { removeMemberFromGroup } from "@/data-access/group";
import { ServerResponseMessage } from "@/lib/types";
import { GroupMemberDto } from "@/use-case/groups/types";
import { revalidatePath } from "next/cache";

export async function removeMemberAction(
  groupMemberDto: GroupMemberDto
): Promise<ServerResponseMessage> {
  return await removeMemberFromGroup(
    groupMemberDto.groupId,
    groupMemberDto.id
  ).then((res) => {
    if (res) {
      revalidatePath(`/groups/${groupMemberDto.groupId}`);
      return { message: "Member removed from group", status: 200 };
    } else {
      return { message: "Could not remove member from group", status: 500 };
    }
  });
}
