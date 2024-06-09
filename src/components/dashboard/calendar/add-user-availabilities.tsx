"use client";

import { addUserAvailabilitiesAction } from "@/app/(protected)/dashboard/_action/add-user-availabilities";
import { Button } from "@/components/ui/button";
import { DaySelector, daysList } from "@/components/ui/day-selector";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TimePickerRange } from "@/components/ui/time-picker-range";
import { generateAvailabilities } from "@/lib/availabilities/utils";
import { type UserAvailabilityDto } from "@/use-case/users/types";
import { useState, useTransition } from "react";
import { PulseLoader } from "react-spinners";
import { useToast } from "@/components/ui/use-toast";

export function AddUserAvailabilities() {
  const [range, setRange] = useState<TimePickerRange | undefined>(undefined);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  function handleAddAvailabilities() {
    if (!range || selectedDays.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "At least one day along with a start and end time are required",
      });
      return;
    }

    startTransition(async () => {
      try {
        const availabilities: UserAvailabilityDto[] = generateAvailabilities(
          selectedDays,
          range
        );

        await addUserAvailabilitiesAction({ availabilities }).then((res) => {
          if (res.status === 200) {
            toast({
              title: "Success",
              description: res.message,
            });
            setOpen(false);
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: res.message,
            });
          }
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong, please try again",
        });
      }
    });
  }

  return (
    <div className='flex flex-col gap-2 self-center w-full'>
      <Sheet
        open={open}
        onOpenChange={() => {
          setOpen(!open);
          setRange(undefined);
          setSelectedDays([]);
        }}>
        <SheetTrigger asChild>
          <Button>Add Availabilities</Button>
        </SheetTrigger>
        <SheetContent side='right'>
          <div className='grid gap-4 px-2 mt-12'>
            <h2 className='text-lg font-semibold'>Add Availabilities</h2>
            <p className='text-sm font-light'>
              Add your availabilities to your profile. This will help group
              owners and event organizers to know when you are available.
            </p>
            <div className='flex flex-col gap-4 mt-6'>
              <Label>Days availables</Label>
              <DaySelector
                selectedDays={selectedDays}
                setSelectedDays={setSelectedDays}
              />
            </div>
            <div className='flex flex-col gap-4'>
              <TimePickerRange
                range={range}
                setRange={setRange}
              />
            </div>
            <Button
              className='mt-5'
              disabled={isPending || !range || selectedDays.length === 0}
              onClick={handleAddAvailabilities}>
              {isPending ? <PulseLoader size={4} /> : "Add Availabilities"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
