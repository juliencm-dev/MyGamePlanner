"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { DayPicker, useDayPicker, useNavigation } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { format, setMonth } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select";
import { Label } from "@radix-ui/react-dropdown-menu";
import { FROM_YEAR, TO_YEAR } from "@/lib/calendar/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  showTodayLabel?: boolean;
  selectedLabel?: Date;
};

function Calendar({
  className,
  classNames,
  selectedLabel,
  showOutsideDays = true,
  showTodayLabel = true,
  ...props
}: CalendarProps) {
  const formatedToday = selectedLabel
    ? format(selectedLabel as Date, "MMMM do yyyy")
    : format(new Date(), "MMMM do yyyy");
  return (
    <div className='flex flex-col'>
      {showTodayLabel && (
        <Label className='self-center font-semibold'>{formatedToday}</Label>
      )}

      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        classNames={{
          months:
            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium hidden",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-[1px]",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: cn(
            "relative p-[1px] text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
            props.mode === "range"
              ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md  last:[&:has([aria-selected])]:rounded-r-md"
              : "[&:has([aria-selected])]:rounded-md"
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
          ),
          day_range_start: "day-range-start",
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-secondary/10 hover:text-accent-foreground focus:bg-primary focus:text-primary-foreground",
          day_today:
            "bg-secondary/40 text-accent-foreground hover:bg-secondary/10",
          day_outside:
            "day-outside text-muted-foreground opacity-50  aria-selected:bg-accent/50 aria-selected:text-accent-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          caption_dropdowns: "flex items-center gap-1",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeftIcon className='h-4 w-4' />,
          IconRight: ({ ...props }) => <ChevronRightIcon className='h-4 w-4' />,
          Dropdown: (props) => {
            const { fromDate, fromMonth, fromYear, toDate, toMonth, toYear } =
              useDayPicker();

            const { goToMonth, currentMonth } = useNavigation();

            const selectItems = Array.from({ length: 12 }, (_, i) => ({
              value: i.toString(),
              label: format(setMonth(new Date(), i), "MMM"),
            }));

            if (props.name === "months") {
              return (
                <Select
                  onValueChange={(value) => {
                    const newDate = new Date(currentMonth);
                    newDate.setMonth(Number(value));
                    goToMonth(newDate);
                  }}
                  value={props.value?.toString()}>
                  <SelectTrigger className='text-accent-foreground border-accent-foreground/50'>
                    {format(currentMonth, "MMM")}
                  </SelectTrigger>
                  <SelectContent>
                    {selectItems.map((item) => (
                      <SelectItem
                        key={item.value}
                        value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            } else if (props.name === "years") {
              const earliestYear =
                fromYear || fromMonth?.getFullYear() || fromDate?.getFullYear();
              const latestYear =
                toYear || toMonth?.getFullYear() || toDate?.getFullYear();
              let selectItems: { value: string; label: string }[] = [];
              if (earliestYear && latestYear) {
                const yearsLength = latestYear - earliestYear + 1;
                selectItems = Array.from({ length: yearsLength }, (_, i) => ({
                  value: (earliestYear + i).toString(),
                  label: (earliestYear + i).toString(),
                }));
                return (
                  <Select
                    onValueChange={(value) => {
                      const newDate = new Date(currentMonth);
                      newDate.setFullYear(Number(value));
                      goToMonth(newDate);
                    }}
                    value={props.value?.toString()}>
                    <SelectTrigger className='text-accent-foreground border-accent-foreground/50'>
                      {currentMonth.getFullYear()}
                    </SelectTrigger>
                    <SelectContent>
                      {selectItems.map((item) => (
                        <SelectItem
                          key={item.value}
                          value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }
            }
            return null;
          },
        }}
        {...props}
      />
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
