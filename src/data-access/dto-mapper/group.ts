import { Group, GroupMemberWithRelations, InviteToken } from "@/db/schema";
import {
  GroupDto,
  GroupInviteTokenDto,
  GroupMemberDto,
} from "@/use-case/groups/types";
import { toUserAvailabilityDtoMapper } from "@/data-access/dto-mapper/user";

export function tokenMapper(inviteToken: InviteToken) {
  return {
    expires: inviteToken.expires,
    token: inviteToken.token,
  } as GroupInviteTokenDto;
}

export function toGroupDtoMapper(
  groups: Group[],
  isFavourite?: boolean[]
): GroupDto[] {
  return groups.map((group, idx) => {
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      image: group.image,
      isFavourite: isFavourite?.[idx] ?? false,
      ownerId: group.ownerId,
    } as GroupDto;
  });
}

export function toGroupMemberDtoMapper(
  groupMembers: GroupMemberWithRelations[]
): GroupMemberDto[] {
  return groupMembers.map((member) => {
    return {
      name: member.user.name,
      role: member.role,
      image: member.user.image,
      id: member.userId,
      groupId: member.groupId,
      availability: toUserAvailabilityDtoMapper(member.user.availability || []),
      absences: member.user.absences || [],
    } as GroupMemberDto;
  });
}

export function toGroupMapper(group: GroupDto): Group {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    image: group.image,
    ownerId: group.ownerId,
  } as Group;
}
