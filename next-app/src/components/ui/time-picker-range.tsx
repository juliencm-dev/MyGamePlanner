import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { TimeSelector, TimeSelectorProps } from "./time-selector";
import { Label } from "@radix-ui/react-dropdown-menu";

export type TimeRangeProps = {
  hours: number;
  minutes: number;
  amPm: "AM" | "PM";
};

export type TimePickerRange = {
  from: TimeRangeProps;
  to: TimeRangeProps;
};

type TimePickerProps = {
  range: TimePickerRange | undefined;
  setRange: (timeRange: TimePickerRange) => void;
};

export function TimePickerRange({ range, setRange }: TimePickerProps) {
  const [hoursFrom, setHoursFrom] = useState(12);
  const [minutesFrom, setMinutesFrom] = useState(0);
  const [amPmFrom, setAmPmFrom] = useState("AM");

  const [hoursTo, setHoursTo] = useState(12);
  const [minutesTo, setMinutesTo] = useState(0);
  const [amPmTo, setAmPmTo] = useState("AM");

  const timeFromProps: TimeSelectorProps = {
    hours: hoursFrom,
    minutes: minutesFrom,
    amPm: amPmFrom as "AM" | "PM",
    setHours: setHoursFrom,
    setMinutes: setMinutesFrom,
    setAmPm: setAmPmFrom,
  };

  const timeToProps: TimeSelectorProps = {
    hours: hoursTo,
    minutes: minutesTo,
    amPm: amPmTo as "AM" | "PM",
    setHours: setHoursTo,
    setMinutes: setMinutesTo,
    setAmPm: setAmPmTo,
  };

  useEffect(() => {
    let newTimeRange: TimePickerRange;

    const adjustedHoursFrom =
      amPmFrom === "PM" && hoursFrom !== 12
        ? hoursFrom + 12
        : amPmFrom === "AM" && hoursFrom === 12
        ? 0
        : hoursFrom;

    const adjustedHoursTo =
      amPmTo === "PM" && hoursTo !== 12
        ? hoursTo + 12
        : amPmTo === "AM" && hoursTo === 12
        ? 0
        : hoursTo;

    if (!range)
      newTimeRange = {
        from: { hours: 12, minutes: 0, amPm: "AM" },
        to: { hours: 12, minutes: 0, amPm: "AM" },
      } as TimePickerRange;
    else {
      newTimeRange = {
        from: {
          hours: adjustedHoursFrom,
          minutes: minutesFrom,
          amPm: amPmFrom,
        },
        to: { hours: adjustedHoursTo, minutes: minutesTo, amPm: amPmTo },
      } as TimePickerRange;
    }

    setRange(newTimeRange);
  }, [hoursFrom, hoursTo, minutesFrom, minutesTo, amPmFrom, amPmTo]);

  return (
    <div className='flex gap-2 w-full self-center mb-4 z-50'>
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
                  {`${range.from.hours
                    .toString()
                    .padStart(2, "0")} : ${range.from.minutes
                    .toString()
                    .padStart(2, "0")} ${range.from.amPm}`}{" "}
                  -{" "}
                  {`${range.to.hours
                    .toString()
                    .padStart(2, "0")} : ${range.to.minutes
                    .toString()
                    .padStart(2, "0")} ${range.to.amPm}`}
                </>
              ) : (
                <>
                  {`${range.from
                    .toString()
                    .padStart(2, "0")} : ${range.from.minutes
                    .toString()
                    .padStart(2, "0")} ${range.from.amPm}`}
                </>
              )
            ) : (
              <span>Pick a time</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='absolute flex flex-col gap-4 w-auto p-4 right-12 bottom-[-2rem]'
          align='start'>
          <Label className='text-accent-foreground font-semibold'>
            Select Time Range
          </Label>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <Label className='text-sm text-secondary'>Available From</Label>
              <TimeSelector props={timeFromProps} />
            </div>
            <div className='flex flex-col gap-2'>
              <Label className='text-sm text-secondary'>Available To</Label>
              <TimeSelector props={timeToProps} />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
