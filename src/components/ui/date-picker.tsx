"use client";

import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "@/components/ui/time-picker";
import { Matcher } from "react-day-picker";

export type AvailablePlayersProps = {
  allPlayersAvailable: Date[];
  minPlayersAvailable: Date[];
};

export function DatePicker({
  players,
  date,
  setDate,
  setEndDate,
}: {
  players?: AvailablePlayersProps;
  date: Date | undefined;
  setDate: (date: Date) => void;
  setEndDate?: (date: Date) => void;
}) {
  const thisYear = new Date().getFullYear();
  const maxYear = thisYear + 5;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}>
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, "PPP '-' HH:mm a") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='absolute flex flex-col w-auto p-0 right-52 bottom-[-12rem]'>
        <div className='self-center mt-2'>Event Date:</div>
        <Calendar
          mode='single'
          showTodayLabel={false}
          captionLayout={"dropdown-buttons"}
          fromYear={thisYear}
          toYear={maxYear}
          modifiers={{
            available: players?.allPlayersAvailable || [],
            minPlayersAvailable: players?.minPlayersAvailable || [],
          }}
          modifiersClassNames={{
            available:
              "bg-green-500/80 text-primary hover:bg-green-700 hover:text-primary focus:bg-green-300 focus:text-black disabled:bg-muted/50 disabled:text-gray-500 disabled:hover:bg-gray-300 disabled:hover:text-gray-500 disabled:focus:bg-gray-300 disabled:focus:text-gray-500",
            minPlayersAvailable:
              "bg-yellow-500/30 text-primary hover:bg-yellow-700 hover:text-primary focus:bg-yellow-200 focus:text-black disabled:bg-muted/50 disabled:text-gray-500 disabled:hover:bg-gray-300 disabled:hover:text-gray-500 disabled:focus:bg-gray-300 disabled:focus:text-gray-500",
          }}
          selected={date}
          onSelect={(day) => {
            if (setEndDate) {
              setEndDate(day as Date);
            }
            setDate(day as Date);
          }}
          onMonthChange={(month) => {
            if (setEndDate) {
              setEndDate(month as Date);
            }
            setDate(month as Date);
          }}
        />
        <div className='self-center mb-4'>Event Time:</div>
        <TimePicker
          date={date}
          onChange={(day) => {
            if (setEndDate) {
              setEndDate(day as Date);
            }
            setDate(day as Date);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
