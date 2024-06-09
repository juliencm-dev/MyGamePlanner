import "server-only";

import { and, eq } from "drizzle-orm";
import { db } from "@/db/db";
import {
  users,
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
import { cache } from "react";

/**
 * Maps an array of UserWithRelations objects to an array of UserDto objects.
 * @param users - The array of UserWithRelations objects to be mapped.
 * @returns An array of UserDto objects.
 */
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

/**
 * Maps an array of Availability objects to an array of UserAvailabilityDto objects.
 * @param availabilities - The array of Availability objects to be mapped.
 * @returns An array of UserAvailabilityDto objects.
 */
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

/**
 * Maps an array of UserAvailabilityDto objects to an array of Availability objects.
 * @param availabilities - The array of UserAvailabilityDto objects to be mapped.
 * @param userId - The ID of the user.
 * @returns An array of Availability objects.
 */
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

/**
 * Retrieves the current authenticated user.
 * @returns A Promise that resolves to a UserDto object representing the current user.
 * @throws An error if the user is not authenticated or if the user cannot be found.
 *
 * Return of this function is cached for 30 minutes.
 */
export const getCurrentUser = cache(async (): Promise<UserDto> => {
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
});

/**
 * Adds a group to the user's favorite groups.
 * @param groupId - The ID of the group to be added.
 * @throws An error if the user is not authenticated or if the group cannot be added to favorites.
 */
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

/**
 * Removes a group from the user's favorite groups.
 * @param groupId - The ID of the group to be removed.
 * @throws An error if the user is not authenticated or if the group cannot be removed from favorites.
 */
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

/**
 * Removes a group from the user's favorite groups by user ID and group ID.
 * @param groupId - The ID of the group to be removed.
 * @param userId - The ID of the user.
 * @throws An error if the group cannot be removed from favorites.
 */
export async function removeUserFavoriteGroupByUserId({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) {
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

/**
 * Retrieves the user's favorite groups.
 * @returns A Promise that resolves to an array of GroupDto objects representing the user's favorite groups.
 * @throws An error if the user is not authenticated or if there is an error retrieving the favorite groups.
 */
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

/**
 * Creates user availabilities.
 * @param availabilitiesDto - An array of UserAvailabilityDto objects representing the user's availabilities.
 * @throws An error if the user is not authenticated or if there is an error creating the availabilities.
 */
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
