"use server";

import { NotificationProps } from "@/components/groups/join/add-member-button";
import { addMemberToGroup, getGroupById } from "@/db/data-access/groups";
import { getCurrentUser } from "@/db/data-access/user";
import { ServerResponseMessage } from "@/lib/types";

export async function addMemberToGroupAction(
  groupId: string,
  userId: string
): Promise<ServerResponseMessage> {
  try {
    const user = await getCurrentUser();
    const group = await getGroupById(groupId);

    await addMemberToGroup(groupId, userId);

    return {
      message: "Group joined successfully",
      notification: {
        message: `${user.name} has joined ${group.name}`,
        sender: user.id,
        receivers: [group.ownerId],
        target: group.id,
      } as NotificationProps,
      status: 201,
    };
  } catch (error) {
    return { message: "Failed to join group", status: 400 };
  }
}
