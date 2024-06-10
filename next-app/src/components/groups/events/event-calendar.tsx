"use client";

import { Calendar } from "@/components/ui/calendar";
import { EventCard } from "@/components/groups/events/event-card";
import { useState } from "react";
import { type GroupDataProps, useGroup } from "@/context/group-context";
import { Label } from "@/components/ui/label";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export function EventCalendar() {
  const { events } = useGroup() as GroupDataProps;

  const thisYear = new Date().getFullYear();
  const maxYear = thisYear + 5;

  const [date, setDate] = useState<Date | undefined>(new Date());

  const eventsDates = events.map((event) => {
    return event.startDate;
  });

  return (
    <fieldset className='flex gap-2 border p-4 rounded-lg col-span-2 place-items-center'>
      <legend className='text-lg px-1'>Calendar</legend>
      <Calendar
        mode='single'
        captionLayout={"dropdown-buttons"}
        fromYear={thisYear}
        toYear={maxYear}
        modifiers={{
          events: eventsDates.flat() || [],
        }}
        modifiersClassNames={{
          events: cn(
            "bg-gradient-to-t from-yellow-500/20 border border-yellow-500/30",
            "text-primary hover:text-primary disabled:bg-muted/50 disabled:text-gray-500 disabled:hover:bg-gray-300 disabled:hover:text-gray-500 disabled:focus:bg-gray-300 disabled:focus:text-gray-500"
          ),
        }}
        selectedLabel={date}
        selected={date}
        onSelect={(day) => setDate(day as Date)}
      />
      {events.length === 0 ||
      events.filter((event) => event.startDate.getDate() === date?.getDate())
        .length === 0 ? (
        <Label className='p-4 text-muted-foreground flex gap-4 justify-center w-[36rem]'>
          <ExclamationTriangleIcon className='w-6 h-6 text-yellow-500' />
          <div className='self-center'>
            There are currently no events on the selected date.
          </div>
        </Label>
      ) : (
        <Carousel className='w-full max-w-[36.5rem]'>
          <CarouselContent>
            {events
              .filter((event) => event.startDate.getDate() === date?.getDate())
              .map((event, index) => (
                <CarouselItem
                  key={index}
                  className=''>
                  <EventCard
                    event={event}
                    confirmations={event.confirmations}
                  />
                </CarouselItem>
              ))}
          </CarouselContent>
          <div className='flex justify-around w-full mt-2'>
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      )}
    </fieldset>
  );
}
