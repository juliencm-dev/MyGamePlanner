import "server-only";

import { and, eq } from "drizzle-orm";
import { db } from "@/db/db";
import {
  users,
  Group,
  userFavoriteGroups,
  groups,
  memberAvailability,
} from "@/db/schema";
import { UserAvailabilityDto, UserDto } from "@/db/data-access/dto/users/types";
import { toGroupDtoMapper } from "@/db/data-access/dto-mapper/groups";
import { auth } from "@/auth";
import { cache } from "react";
import {
  toAvailabilityMapper,
  toUserDtoMapper,
} from "@/db/data-access/dto-mapper/users";

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
