"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type EventConfirmationDto,
  type EventDto,
} from "@/use-case/events/types";
import { format } from "date-fns";
import { MembersAttendanceList } from "@/components/groups/events/members-attendance-list";
import { UserAttendanceConfirmation } from "@/components/groups/events/user-attendance-confirmation";
import { GroupDataProps, useGroup } from "@/context/group-context";

export function EventCard({
  event,
  confirmations,
}: {
  event: EventDto;
  confirmations: EventConfirmationDto[];
}) {
  const { loggedInUser } = useGroup() as GroupDataProps;

  return (
    <div className='relative h-full'>
      <Card className='w-[36rem] h-full self-center mb-3 place-content-around bg-gradient-to-t from-secondary/10'>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>{event?.name}</CardTitle>
          <CardDescription className='font-semibold text-stone-300'>
            {event?.gameName}
          </CardDescription>
          <CardDescription>{event?.description}</CardDescription>
        </CardHeader>
        <CardContent className='relative flex flex-col gap-1'>
          <div className='flex flex-col gap-1'>
            <div className='flex gap-2'>
              <span className='text-sm font-semibold'>Start:</span>
              <span className='text-sm font-extralight'>
                {format(event.startDate, "yyyy-MM-dd HH:MM")}
              </span>
            </div>
            <div className='flex gap-2'>
              <span className='text-sm font-semibold'>End:</span>
              <span className='text-sm font-extralight'>
                {format(event.endDate, "yyyy-MM-dd HH:MM")}
              </span>
            </div>
          </div>
          <MembersAttendanceList confirmations={confirmations} />
        </CardContent>
      </Card>
      <UserAttendanceConfirmation
        event={event}
        currentUserConfirmation={
          confirmations.find((c) => c.userId === loggedInUser.id)?.attending ??
          0
        }
      />
    </div>
  );
}
