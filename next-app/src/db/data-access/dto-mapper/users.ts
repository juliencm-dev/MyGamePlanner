import { Availability, UserWithRelations } from "@/db/schema";
import { UserAvailabilityDto, UserDto } from "@/db/data-access/dto/users/types";
import { getImageFromBucket } from "@/db/s3";

/**
 * Maps an array of UserWithRelations objects to an array of UserDto objects.
 * @param users - The array of UserWithRelations objects to be mapped.
 * @returns An array of UserDto objects.
 */
export async function toUserDtoMapper(users: UserWithRelations[]): Promise<UserDto[]> {
  return await Promise.all(
    users.map(async user => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt,
        aboutMe: user.aboutMe,
        image: await processUserAvatarImage({ imageString: user.image || undefined }),
        absences: [],
        availabilities: toUserAvailabilityDtoMapper(user.availability || []),
      } as UserDto;
    })
  );
}

export async function processUserAvatarImage({ imageString }: { imageString: string | undefined }) {
  if (!imageString) return "";
  if (imageString.startsWith("uaImg-")) {
    const imageUrl = await getImageFromBucket({ key: imageString });
    return imageUrl;
  } else {
    return imageString;
  }
}

/**
 * Maps an array of Availability objects to an array of UserAvailabilityDto objects.
 * @param availabilities - The array of Availability objects to be mapped.
 * @returns An array of UserAvailabilityDto objects.
 */
export function toUserAvailabilityDtoMapper(availabilities: Availability[]): UserAvailabilityDto[] {
  return availabilities.map(availability => {
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
export function toAvailabilityMapper(availabilities: UserAvailabilityDto[], userId: string): Availability[] {
  return availabilities.map(availability => {
    return {
      userId: userId,
      dayOfWeek: availability.dayOfWeek,
      startTime: availability.startTime,
      endTime: availability.endTime,
    } as Availability;
  });
}
