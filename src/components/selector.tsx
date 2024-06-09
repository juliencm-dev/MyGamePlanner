"use client";

import { type GameDto } from "@/db/data-access/dto/games/types";
import { type EventDto } from "@/db/data-access/dto/events/types";
import { type GroupMemberDto } from "@/db/data-access/dto/groups/types";

import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { CommandList } from "cmdk";

export function Selector({
  placeholder,
  data,
  selectedId,
  setSelectedId,
  setSelectedName,
  className,
}: {
  placeholder: string[];
  data: EventDto[] | GameDto[] | GroupMemberDto[];
  selectedId: string;
  setSelectedId: (value: string) => void;
  setSelectedName: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

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
          {selectedId
            ? data.find((item) => item.id === selectedId)?.name
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
              {data.map((item, idx) => (
                <CommandItem
                  key={idx}
                  value={item.id}
                  onSelect={(currentValue) => {
                    setSelectedId(
                      currentValue === selectedId ? "" : currentValue
                    );
                    setSelectedName(
                      currentValue === selectedId ? "" : item.name
                    );
                    setOpen(false);
                  }}>
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedId === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
