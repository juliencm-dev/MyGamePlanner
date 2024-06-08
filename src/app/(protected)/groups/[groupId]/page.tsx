import { type GroupDto, type GroupMemberDto } from "@/use-case/groups/types";
import { getGroupById, getGroupMembers } from "@/data-access/group";
import { getInviteLink } from "@/lib/tokens";
import { getGamesByGroupId } from "@/data-access/games";
import { type GameDto } from "@/use-case/games/types";
import { type UserAvailabilityDto, type UserDto } from "@/use-case/users/types";
import { getCurrentUser } from "@/data-access/user";
import { type GroupDataProps } from "@/context/group-context";
import { GroupClientWrapper } from "@/components/groups/group-client-wrapper";
import { redirect } from "next/navigation";
import { getEventsAndAttendanceByGroupId } from "@/data-access/events";
import { EventDto } from "@/use-case/events/types";

export default async function SelectedGroupPage({
  params,
}: {
  params: { groupId: string };
}) {
  const groupId: string = params.groupId;

  const user: UserDto = await getCurrentUser();
  const group: GroupDto = await getGroupById(groupId);
  const members: GroupMemberDto[] = await getGroupMembers(groupId);

  if (!isUserMemberOfGroup(user.id, members)) return redirect("/groups");

  const games: GameDto[] = await getGamesByGroupId({ groupId });
  const memberAvailabilities: UserAvailabilityDto[] = [];
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
    memberAvailabilities,
    games,
    events,
    loggedInUser: user,
    isAdmin,
  };

  return (
    <GroupClientWrapper
      groupData={groupData}
      inviteUrl={inviteUrl}
    />
  );
}

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
