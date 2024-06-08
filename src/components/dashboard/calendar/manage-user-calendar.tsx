"use client";

import { FROM_YEAR, TO_YEAR } from "@/lib/calendar/utils";

import { Calendar } from "@/components/ui/calendar";
import { UserConfirmedEvents } from "@/components/dashboard/calendar/user-confirmed-events";
import { AddUserAvailabilities } from "@/components/dashboard/calendar/add-user-availabilities";
import { AddUserAbsences } from "@/components/dashboard/calendar/add-user-absences";
import { useState } from "react";
import { Attendance, type EventDto } from "@/use-case/events/types";
import { UserDto } from "@/use-case/users/types";
import { cn } from "@/lib/utils";
import { group } from "console";

export function ManageUserCalendar({
  events,
  user,
}: {
  events: EventDto[];
  user: UserDto;
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  let groupColor;
  const confirmedEventDates = events
    .filter((e) => {
      return e.confirmations.some(
        (c) => c.userId === user.id && c.attending === Attendance.CONFIRMED
      );
    })
    .map((event) => {
      groupColor = `bg-gradient-to-t from-${
        event.groupColor ?? "secondary"
      }/20 border border-${event.groupColor ?? "secondary"}/30`;
      return event.startDate;
    });

  return (
    <fieldset className='grid grid-cols-[1fr_2fr] col-span-2 gap-2 border p-4 rounded-lg'>
      <legend className='text-lg px-1'>Calendar</legend>
      <div className='flex flex-col gap-2 m-auto'>
        <Calendar
          mode='single'
          showTodayLabel={true}
          className='self-center'
          captionLayout='dropdown-buttons'
          fromYear={FROM_YEAR}
          toYear={TO_YEAR}
          modifiers={{
            confirmedEvents: confirmedEventDates.flat() || [],
          }}
          modifiersClassNames={{
            confirmedEvents: cn(
              groupColor,
              "text-primary hover:text-primary disabled:bg-muted/50 disabled:text-gray-500 disabled:hover:bg-gray-300 disabled:hover:text-gray-500 disabled:focus:bg-gray-300 disabled:focus:text-gray-500"
            ),
          }}
          selected={date}
          selectedLabel={date}
          onSelect={(day) => setDate(day as Date)}
        />
        <AddUserAbsences />
        <AddUserAvailabilities />
      </div>
      <UserConfirmedEvents
        date={date}
        events={events}
        user={user}
      />
    </fieldset>
  );
}
