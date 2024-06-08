"use server";
import { deleteGroup } from "@/data-access/group";
import { ServerResponseMessage } from "@/lib/types";
import { GroupDto } from "@/use-case/groups/types";
import { revalidatePath } from "next/cache";

export async function deleteGroupAction(
  group: GroupDto
): Promise<ServerResponseMessage> {
  return await deleteGroup(group.id as string).then((res) => {
    if (res) {
      revalidatePath(`/groups`);
      return { message: "Group deleted sucessfuly", status: 200 };
    } else {
      return { message: "Could not delete group", status: 500 };
    }
  });
}
