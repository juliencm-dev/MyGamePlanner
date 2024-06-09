"use server";
import { deleteGroup } from "@/db/data-access/groups";
import { type ServerResponseMessage } from "@/lib/types";
import { type GroupDto } from "@/db/data-access/dto/groups/types";
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
