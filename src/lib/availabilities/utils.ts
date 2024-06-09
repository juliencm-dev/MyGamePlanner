import { type AvailablePlayersProps } from "@/components/ui/date-picker";
import { daysList } from "@/components/ui/day-selector";
import { type TimePickerRange } from "@/components/ui/time-picker-range";
import { type GroupMemberDto } from "@/db/data-access/dto/groups/types";
import { type UserAvailabilityDto } from "@/db/data-access/dto/users/types";
import { DateTime } from "luxon";

export function generateAvailabilities(
  selectedDays: string[],
  range: TimePickerRange
) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const availabilities = selectedDays.map((day) => {
    return {
      dayOfWeek: daysList.indexOf(day),
      startTime: `${range?.from.hours}:${range?.from.minutes} ${timezone}`,
      endTime: `${range?.to.hours}:${range?.to.minutes} ${timezone}`,
    } as UserAvailabilityDto;
  });

  return availabilities;
}

function parseTimeString(timeString: string) {
  const [time, timeZone] = timeString.split(" ");
  const [hours, minutes] = time.split(":").map(Number);

  return { hours, minutes, timeZone };
}

export function getAllAvailabilitiesOccurrencesInMonth({
  availabitilies,
}: {
  availabitilies: UserAvailabilityDto;
}) {
  const startComponents = parseTimeString(availabitilies.startTime);
  const endComponents = parseTimeString(availabitilies.endTime);

  const now = DateTime.now();

  const endOfMonth = now.plus({ months: 6 }).endOf("month");

  const occurrences = [];

  // Find the first occurrence of the specified day in the current month
  let currentDay = now;
  while (currentDay.weekday % 7 !== availabitilies.dayOfWeek) {
    currentDay = currentDay.plus({ days: 1 });
  }

  // Collect all occurrences of the specified day in the current month
  while (currentDay <= endOfMonth) {
    const startDateTime = DateTime.fromObject(
      {
        year: currentDay.year,
        month: currentDay.month,
        day: currentDay.day,
        hour: startComponents.hours,
        minute: startComponents.minutes,
      },
      { zone: startComponents.timeZone }
    );

    const endDateTime = DateTime.fromObject(
      {
        year: currentDay.year,
        month: currentDay.month,
        day: currentDay.day,
        hour: endComponents.hours,
        minute: endComponents.minutes,
      },
      { zone: endComponents.timeZone }
    );

    occurrences.push({
      start: startDateTime.toJSDate(),
      end: endDateTime.toJSDate(),
    });

    // Move to the next week
    currentDay = currentDay.plus({ days: 7 });
  }

  return occurrences;
}

export function getAvailablePlayerProps({
  mandatoryPlayerId,
  minPLayers,
  members,
}: {
  mandatoryPlayerId?: string;
  minPLayers: number;
  members: GroupMemberDto[];
}): AvailablePlayersProps {
  const playersAvailabilities = members.map(
    (member) => member.availability || []
  );

  const allPlayerAvailable: Date[] = [];
  const minPlayersAvailable: Date[] = [];

  // Calculate availability occurrences for each member
  const allPlayersOccurrences = playersAvailabilities.flatMap((availability) =>
    availability.flatMap((dayAvailability) =>
      getAllAvailabilitiesOccurrencesInMonth({
        availabitilies: dayAvailability,
      })
    )
  );

  const dateCounts = allPlayersOccurrences.reduce((acc, date) => {
    const dateStr = date.start.toDateString();
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  if (mandatoryPlayerId) {
    const mandatoryPlayerOccurences = members
      .filter((member) => member.id === mandatoryPlayerId)
      .flatMap((member) => member.availability || [])
      .flatMap((dayAvailability) =>
        getAllAvailabilitiesOccurrencesInMonth({
          availabitilies: dayAvailability,
        })
      );

    const mandatoryPlayerDatesSet = new Set(
      mandatoryPlayerOccurences.map((date) => date.start.toDateString())
    );

    for (const dateStr in dateCounts) {
      if (mandatoryPlayerDatesSet.has(dateStr)) {
        const count = dateCounts[dateStr];
        const date = new Date(dateStr);

        if (count === members.length) {
          allPlayerAvailable.push(date);
        } else if (count >= minPLayers) {
          minPlayersAvailable.push(date);
        }
      }
    }
  } else {
    for (const dateStr in dateCounts) {
      const count = dateCounts[dateStr];
      const date = new Date(dateStr);

      if (count === members.length) {
        allPlayerAvailable.push(date);
      } else if (count >= minPLayers) {
        minPlayersAvailable.push(date);
      }
    }
  }
  return {
    allPlayersAvailable: allPlayerAvailable,
    minPlayersAvailable: minPlayersAvailable,
  } as AvailablePlayersProps;
}
