import { type Group, type GroupMemberWithRelations, type InviteToken } from "@/db/schema";
import { type GroupDto, type GroupInviteTokenDto, type GroupMemberDto } from "@/db/data-access/dto/groups/types";
import { processUserAvatarImage, toUserAvailabilityDtoMapper } from "@/db/data-access/dto-mapper/users";

export function tokenMapper(inviteToken: InviteToken) {
  return {
    expires: inviteToken.expires,
    token: inviteToken.token,
  } as GroupInviteTokenDto;
}

/**
 * Maps an array of Group objects to an array of GroupDto objects.
 *
 * @param groups - The array of Group objects to be mapped.
 * @param isFavourite - An optional array of booleans indicating whether each group is a favorite.
 * @returns An array of GroupDto objects.
 */
export function toGroupDtoMapper(groups: Group[], isFavourite?: boolean[]): GroupDto[] {
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

export async function toGroupMemberDtoMapper(groupMembers: GroupMemberWithRelations[]): Promise<GroupMemberDto[]> {
  return await Promise.all(
    groupMembers.map(async member => {
      return {
        name: member.user.displayName ?? member.user.name,
        role: member.role,
        image: await processUserAvatarImage({ imageString: member.user.image || undefined }),
        id: member.userId,
        groupId: member.groupId,
        availability: toUserAvailabilityDtoMapper(member.user.availability || []),
        absences: member.user.absences || [],
      } as GroupMemberDto;
    })
  );
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
