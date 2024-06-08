"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Attendance, type EventDto } from "@/use-case/events/types";
import { UserDto } from "@/use-case/users/types";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

export function UserConfirmedEvents({
  date,
  events,
  user,
}: {
  date: Date | undefined;
  events: EventDto[];
  user: UserDto;
}) {
  return (
    <fieldset className='border p-2 rounded-lg'>
      <legend className='text-lg px-1'>Events</legend>
      <ScrollArea className='col-span-2 w-full h-[28.8rem] rounded-none'>
        <div className='flex flex-col gap-5 px-4'>
          {events.length === 0 ||
          events.filter((e) => {
            // Filtering events by confirmed attendance and date
            return (
              e.confirmations.some(
                (c) =>
                  c.userId === user.id && c.attending === Attendance.CONFIRMED
              ) && e.startDate.getDate() === date?.getDate()
            );
          }).length === 0 ? (
            <Label className='p-4 text-muted-foreground flex gap-4 m-auto'>
              <ExclamationTriangleIcon className='w-6 h-6 text-yellow-500' />
              <div className='self-center'>
                There are currently no confirmed events on the selected date.
              </div>
            </Label>
          ) : (
            events
              .filter((e) => {
                return (
                  e.confirmations.some(
                    (c) =>
                      c.userId === user.id &&
                      c.attending === Attendance.CONFIRMED
                  ) && e.startDate.getDate() === date?.getDate()
                );
              })
              .map((event) => {
                const confirmations = event.confirmations.filter(
                  (c) => c.attending === Attendance.CONFIRMED
                );

                return (
                  <Card
                    key={event.id}
                    className='self-center bg-gradient-to-t from-secondary/10'>
                    <CardHeader>
                      <CardTitle className='text-xl font-semibold'>
                        {event?.name}
                      </CardTitle>
                      <CardDescription className='font-semibold text-stone-300'>
                        {event?.gameName}
                      </CardDescription>
                      <CardDescription>{event?.description}</CardDescription>
                    </CardHeader>
                    <CardContent className='relative flex flex-col gap-4'>
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
                      <div className='text-sm text-secondary'>
                        {`${confirmations.length} member${
                          confirmations.length > 0 ? "s" : ""
                        } have confirmed ${
                          confirmations.length > 0 ? "their" : "his/her"
                        } attendance to this event.`}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
          )}
        </div>
      </ScrollArea>
    </fieldset>
  );
}
