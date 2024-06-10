"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "@radix-ui/react-icons";
import { createGroupeAction } from "@/app/(protected)/groups/_actions/create-group";
import { useRef, useState, useTransition } from "react";
import { PulseLoader } from "react-spinners";

export function CreateGroupButton() {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleCreateGroup = async (formData: FormData) => {
    startTransition(async () => {
      await createGroupeAction(formData);
      setOpen(false);
      formRef.current?.reset();
    });
  };

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className='grid w-full h-[300px] sm:w-[300px] sm:h-[300px] border rounded-lg bg-muted/20 cursor-pointer hover:bg-muted/50'>
          <PlusIcon
            className='m-auto text-muted-foreground'
            height={50}
            width={50}
          />
        </div>
      </SheetTrigger>
      <SheetContent side='right'>
        <form
          action={handleCreateGroup}
          className='grid gap-4 px-2 mt-12'
          ref={formRef}>
          <h2 className='text-lg font-semibold'>Create a Group</h2>
          <p className='text-sm font-light'>
            Organize your games and invite your friends, manage availabilities
            and absences.
          </p>
          <div className='flex flex-col gap-4'>
            <Label>Name</Label>
            <Input
              name='name'
              type='text'
              disabled={isPending}
              required
            />
          </div>
          <div className='flex flex-col gap-4'>
            <Label>Description</Label>
            <Textarea
              name='description'
              maxLength={144}
              className='h-32'
              disabled={isPending}
              required
            />
          </div>
          <Button
            className='mt-5'
            disabled={isPending}>
            {isPending ? <PulseLoader size={4} /> : "Create"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
