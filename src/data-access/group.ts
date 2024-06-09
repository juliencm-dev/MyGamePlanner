import "server-only";

import { and, eq } from "drizzle-orm";
import { db } from "@/db/db";
import {
  Group,
  GroupMemberWithRelations,
  InviteToken,
  groupInviteTokens,
  groupMembers,
  groups,
  userFavoriteGroups,
} from "@/db/schema";

import {
  GroupDto,
  GroupInviteTokenDto,
  GroupMemberDto,
  UpdateMemberDto,
} from "@/use-case/groups/types";
import { auth } from "@/auth";
import {
  removeAttendanceByGroupAndUserId,
  updateAttendanceByGroupId,
} from "./events";
import {
  removeUserFavoriteGroupByUserId,
  toUserAvailabilityDtoMapper,
} from "./user";
import { cache } from "react";

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
export async function createGroup(newGroup: GroupDto) {
  const group = toGroupMapper(newGroup);

  try {
    await db.transaction(async (trx) => {
      const createdGroup: Group[] = await trx
        .insert(groups)
        .values(group)
        .returning();

      await trx.insert(groupMembers).values({
        groupId: createdGroup[0].id,
        userId: group.ownerId,
        role: "Group Owner",
      });
    });
  } catch (error) {
    throw new Error("Could not create group");
  }
}

export async function deleteGroup(groupId: string) {
  return await db.delete(groups).where(eq(groups.id, groupId));
}

export async function addMemberToGroup(groupId: string, userId: string) {
  try {
    await db.insert(groupMembers).values({
      groupId,
      userId,
    });
    await updateAttendanceByGroupId(groupId);
  } catch (error) {
    throw new Error("Could not add member to group");
  }
}

export async function removeMemberFromGroup(groupId: string, userId: string) {
  try {
    await db
      .delete(groupMembers)
      .where(
        and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId))
      );

    await removeUserFavoriteGroupByUserId({ groupId, userId });
    await removeAttendanceByGroupAndUserId({ groupId, userId });
  } catch (error) {
    throw new Error("Could not remove member from group");
  }
}

export async function updateMemberRole(member: UpdateMemberDto) {
  return await db
    .update(groupMembers)
    .set({
      role: member.role,
    })
    .where(
      and(
        eq(groupMembers.groupId, member.groupId),
        eq(groupMembers.userId, member.userId)
      )
    );
}

export async function getUserGroups(): Promise<GroupDto[]> {
  const { getUser } = await auth();
  const user = getUser();

  if (!user) throw new Error("User not authenticated");

  const userId = user.id;

  const foundUserOwnedGroups = await db.query.groups.findMany({
    where: eq(groups.ownerId, userId),
  });

  const foundUserMemberGroups = await db.query.groupMembers.findMany({
    where: eq(groupMembers.userId, userId),
  });

  const filteredUserMemberGroups = foundUserMemberGroups.filter(
    (g) => g.role !== "Group Owner"
  );

  const foundMemberGroupsPromises = filteredUserMemberGroups.map((g) => {
    return db.query.groups.findFirst({
      where: eq(groups.id, g.groupId),
    });
  });

  const foundMemberGroups = await Promise.all(foundMemberGroupsPromises);

  const favouritedGroups = await db
    .select()
    .from(userFavoriteGroups)
    .where(eq(userFavoriteGroups.userId, userId));

  const foundGroups = [...foundUserOwnedGroups, ...foundMemberGroups];

  const isFavourited: boolean[] = foundGroups.map((g) =>
    favouritedGroups.some((f) => f.groupId === g!.id)
  );

  return toGroupDtoMapper(foundGroups as unknown as Group[], isFavourited);
}

export const getGroupMembers = cache(
  async (groupId: string): Promise<GroupMemberDto[]> => {
    const foundMembers = await db.query.groupMembers.findMany({
      where: eq(groupMembers.groupId, groupId),
      with: {
        user: {
          with: {
            availability: true,
            absences: true,
          },
        },
      },
    });

    if (!foundMembers) throw new Error("Could not find group with that id");

    return toGroupMemberDtoMapper(foundMembers);
  }
);

export const getGroupById = cache(
  async (groupId: string): Promise<GroupDto> => {
    const foundGroup = await db.query.groups.findFirst({
      where: eq(groups.id, groupId),
    });

    if (!foundGroup) throw new Error("Could not find group with that id");

    return toGroupDtoMapper([foundGroup])[0];
  }
);

//
// Token Logic for Group Invite
//

export async function getInviteTokenByGroupId(
  groupId: string
): Promise<GroupInviteTokenDto> {
  const token = await db.query.groupInviteTokens.findFirst({
    where: eq(groupInviteTokens.identifier, groupId),
  });

  if (!token) throw new Error("Could not find invite token for that group");

  return tokenMapper(token);
}

export async function createInviteToken({
  groupId,
  token,
  expires,
}: {
  groupId: string;
  token: string;
  expires: Date;
}) {
  return await db.insert(groupInviteTokens).values({
    identifier: groupId,
    token,
    expires,
  });
}

export async function getGroupByToken(token: string): Promise<GroupDto> {
  const foundToken = await db.query.groupInviteTokens.findFirst({
    where: eq(groupInviteTokens.token, token),
  });

  if (!foundToken) throw new Error("Could not find token with that id");

  const foundGroup = await db.query.groups.findFirst({
    where: eq(groups.id, foundToken.identifier),
  });

  if (!foundGroup) throw new Error("Could not find group with that id");

  return toGroupDtoMapper([foundGroup])[0];
}
