"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { CommandList } from "cmdk";
import { cn } from "@/lib/utils";

export const daysList = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function DaySelector({
  selectedDays,
  setSelectedDays,
  className,
}: {
  selectedDays: string[];
  setSelectedDays: (value: string[]) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const placeholder = ["Select available days", "days"];

  const handleSelect = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(
        selectedDays.filter((selectedDay) => selectedDay !== day)
      );
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(`justify-between`, className)}>
          {selectedDays.length > 0
            ? selectedDays.length > 3
              ? `${selectedDays.slice(0, 3).join(", ")} ...`
              : selectedDays.join(", ")
            : placeholder[0]}
          <ChevronDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0 popover-content-width-full'>
        <Command>
          <CommandInput placeholder={`Search ${placeholder[1]} ...`} />
          <CommandEmpty>{`No ${placeholder[1].slice(
            0,
            placeholder[1].length - 1
          )} found.`}</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {daysList.map((item, idx) => (
                <CommandItem
                  key={idx}
                  value={item}
                  onSelect={() => handleSelect(item)}>
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedDays.includes(item) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
