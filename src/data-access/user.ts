import "server-only";

import { and, eq } from "drizzle-orm";
import { db } from "@/db/db";
import {
  users,
  User,
  Group,
  userFavoriteGroups,
  groups,
  memberAvailability,
  Availability,
  UserWithRelations,
} from "@/db/schema";
import { UserAvailabilityDto, UserDto } from "@/use-case/users/types";
import { toGroupDtoMapper } from "@/data-access/group";
import { auth } from "@/auth";

export function toUserDtoMapper(users: UserWithRelations[]): UserDto[] {
  return users.map((user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
      aboutMe: user.aboutMe,
      image: user.image,
      absences: [],
      availabilities: toUserAvailabilityDtoMapper(user.availability || []),
    } as UserDto;
  });
}

export function toUserAvailabilityDtoMapper(
  availabilities: Availability[]
): UserAvailabilityDto[] {
  return availabilities.map((availability) => {
    return {
      userId: availability.userId,
      dayOfWeek: availability.dayOfWeek,
      startTime: availability.startTime,
      endTime: availability.endTime,
    } as UserAvailabilityDto;
  });
}

export function toAvailabilityMapper(
  availabilities: UserAvailabilityDto[],
  userId: string
): Availability[] {
  return availabilities.map((availability) => {
    return {
      userId: userId,
      dayOfWeek: availability.dayOfWeek,
      startTime: availability.startTime,
      endTime: availability.endTime,
    } as Availability;
  });
}

export async function getCurrentUser(): Promise<UserDto> {
  const { getUser } = await auth();
  const user = getUser();

  if (!user) throw new Error("User not authenticated");

  const userId = user.id;

  const foundUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      availability: true,
      absences: true,
    },
  });

  if (!foundUser) {
    throw new Error("Could not find user with that id");
  }

  return toUserDtoMapper([foundUser])[0];
}

export async function addUserFavoriteGroup({ groupId }: { groupId: string }) {
  const { getUser } = await auth();
  const user = getUser();

  if (!user) throw new Error("User not authenticated");

  const userId = user.id;

  try {
    await db.insert(userFavoriteGroups).values({
      userId,
      groupId,
    });
  } catch (error) {
    throw new Error("Failed to add group to favorites");
  }
}

export async function removeUserFavoriteGroup({
  groupId,
}: {
  groupId: string;
}) {
  const { getUser } = await auth();
  const user = getUser();

  if (!user) throw new Error("User not authenticated");

  const userId = user.id;

  try {
    await db
      .delete(userFavoriteGroups)
      .where(
        and(
          eq(userFavoriteGroups.groupId, groupId),
          eq(userFavoriteGroups.userId, userId)
        )
      );
  } catch (error) {
    throw new Error("Failed to remove group from favorites");
  }
}

export async function getUserFavoriteGroups() {
  const { getUser } = await auth();
  const user = getUser();

  if (!user) throw new Error("User not authenticated");

  const userId = user.id;

  try {
    const favoriteGroupsIds = await db
      .select()
      .from(userFavoriteGroups)
      .where(eq(userFavoriteGroups.userId, userId));

    const favoriteGroupsPromises = favoriteGroupsIds.map(
      async (favoriteGroup) => {
        return (await db.query.groups.findFirst({
          where: eq(groups.id, favoriteGroup.groupId),
        })) as Group;
      }
    );

    const favoriteGroups: Group[] = await Promise.all(favoriteGroupsPromises);

    return toGroupDtoMapper(favoriteGroups);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function createUserAvailabilities(
  availabilitiesDto: UserAvailabilityDto[]
) {
  const { getUser } = await auth();
  const user = getUser();

  if (!user) throw new Error("User not authenticated");

  const userId = user.id;

  const availabilities = toAvailabilityMapper(availabilitiesDto, userId);

  try {
    await db.transaction(async (trx) => {
      availabilities.forEach(async (availability) => {
        await trx.insert(memberAvailability).values(availability);
      });
    });
  } catch (error) {
    throw new Error("Failed to add availabilities");
  }
}
