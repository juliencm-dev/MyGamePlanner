import { type GroupDto, type GroupMemberDto } from "@/use-case/groups/types";
import { type GameDto } from "@/use-case/games/types";
import { type UserAvailabilityDto, type UserDto } from "@/use-case/users/types";
import { type GroupDataProps } from "@/context/group-context";

import { getGroupById, getGroupMembers } from "@/data-access/group";
import { getInviteLink } from "@/lib/tokens";
import { getGamesByGroupId } from "@/data-access/games";
import { getCurrentUser } from "@/data-access/user";
import { GroupClientWrapper } from "@/components/groups/group-client-wrapper";
import { redirect } from "next/navigation";
import { getEventsAndAttendanceByGroupId } from "@/data-access/events";
import { EventDto } from "@/use-case/events/types";

export const revalidate = 1800;

export default async function SelectedGroupPage({
  params,
}: {
  params: { groupId: string };
}) {
  const { groupId } = params;

  const groupData: GroupDataProps = await getGroupDataProps({ groupId });

  if (!groupData.group) return redirect("/groups");

  if (!isUserMemberOfGroup(groupData.loggedInUser.id, groupData.members))
    return redirect("/groups");

  return <GroupClientWrapper groupData={groupData} />;
}

// Utility functions for SelectedGroupPage
// TODO: Move these functions to a separate file

function isUserAdmin(userId: string, groupMembers: GroupMemberDto[]): boolean {
  const user = groupMembers.find((member) => member.id === userId);
  return user?.role === "Admin" || user?.role === "Group Owner";
}

function isUserMemberOfGroup(
  userId: string,
  groupMembers: GroupMemberDto[]
): boolean {
  return groupMembers.some((member) => member.id === userId);
}

async function getGroupDataProps({
  groupId,
}: {
  groupId: string;
}): Promise<GroupDataProps> {
  try {
    const user: UserDto = await getCurrentUser();
    const group: GroupDto = await getGroupById(groupId);
    const members: GroupMemberDto[] = await getGroupMembers(groupId);

    const games: GameDto[] = await getGamesByGroupId({ groupId });
    const events: EventDto[] = await getEventsAndAttendanceByGroupId({
      groupId,
    });

    const isAdmin: boolean = isUserAdmin(user.id, members);

    const inviteUrl: string = await getInviteLink({
      groupId: group.id as string,
    });

    const groupData: GroupDataProps = {
      group,
      members,
      games,
      events,
      loggedInUser: user,
      inviteUrl,
      isAdmin,
    };

    return groupData;
  } catch (error) {
    return {} as GroupDataProps;
  }
}
