"use client";

import { addDays, format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FROM_YEAR, TO_YEAR } from "@/lib/calendar/utils";

export function DateRangePicker({
  range,
  setRange,
  className,
}: {
  range: DateRange | undefined;
  setRange: (range: DateRange | undefined) => void;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !range && "text-muted-foreground"
            )}>
            <CalendarIcon className='mr-2 h-4 w-4' />
            {range?.from ? (
              range.to ? (
                <>
                  {format(range.from, "LLL dd, y")} -{" "}
                  {format(range.to, "LLL dd, y")}
                </>
              ) : (
                format(range.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='absolute flex flex-col w-auto p-0 right-12 bottom-[-12rem]'
          align='start'>
          <Calendar
            initialFocus
            mode='range'
            showTodayLabel={false}
            defaultMonth={range?.from}
            captionLayout='dropdown-buttons'
            fromYear={FROM_YEAR}
            toYear={TO_YEAR}
            selected={range}
            onSelect={setRange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
