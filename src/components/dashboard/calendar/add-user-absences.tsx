"use client";

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { addDays } from "date-fns";
import { useRef, useState, useTransition } from "react";
import { DateRange } from "react-day-picker";
import { PulseLoader } from "react-spinners";
import { toast } from "sonner";

export function AddUserAbsences() {
  const initialRange: DateRange = {
    from: new Date(),
    to: addDays(new Date(), 2),
  };
  const [range, setRange] = useState<DateRange | undefined>(initialRange);

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleAddAbsences(formData: FormData) {
    if (!range) {
      toast.error("Error", {
        description: "Start and end date are required",
      });
      return;
    }

    // startTransition(async () => {
    //   await addEventAction({ formData, startDate, endDate, members }).then(
    //     (res) => {
    //       if (res) {
    //         toast("Success", {
    //           description: res.message,
    //         });
    //         setOpen(false);
    //         formRef.current?.reset();
    //       } else {
    //         toast.error("Error", {
    //           description: "Could not add event to group",
    //         });
    //       }
    //     }
    //   );
    // });
  }

  return (
    <div className='flex flex-col gap-2 self-center w-full'>
      <Sheet
        open={open}
        onOpenChange={() => {
          setOpen(!open);
          setRange(initialRange);
        }}>
        <SheetTrigger asChild>
          <Button>Add Absenses</Button>
        </SheetTrigger>
        <SheetContent side='right'>
          <form
            action={handleAddAbsences}
            className='grid gap-4 px-2 mt-12'
            ref={formRef}>
            <h2 className='text-lg font-semibold'>Add Absense</h2>
            <p className='text-sm font-light'>
              Add an absense to the user's profile. You can add a reason and
              specify the start and end date of the absense.
            </p>
            <div className='flex flex-col gap-4 mt-6'>
              <Label>Reason for absense</Label>
              <Input
                name='reason'
                type='text'
                required
              />
            </div>
            <div className='flex flex-col gap-4'>
              <Label>Description</Label>
              <Textarea
                name='description'
                maxLength={288}
                className='h-48 resize-none'
                placeholder='Add a description of the abcense'
              />
            </div>
            <div className='flex flex-col gap-4'>
              <DateRangePicker
                range={range}
                setRange={setRange}
              />
            </div>

            <Button className='mt-5'>
              {isPending ? <PulseLoader size={4} /> : "Add Absense"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
