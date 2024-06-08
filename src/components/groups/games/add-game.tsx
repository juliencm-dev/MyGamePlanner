"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { addGameAction } from "@/app/(protected)/groups/[groupId]/_actions/add-game";
import { useRef, useState, useTransition } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "sonner";
import { type GroupDataProps, useGroup } from "@/context/group-context";

export function AddGame({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { group, loggedInUser } = useGroup() as GroupDataProps;

  function handleAddGame(formData: FormData) {
    startTransition(async () => {
      await addGameAction(formData).then((res) => {
        if (res) {
          toast("Success", {
            description: res.message,
          });
          setOpen(false);
          formRef.current?.reset();
        } else {
          toast.error("Error", {
            description: "Could not add game to group",
          });
        }
      });
    });
  }

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side='right'>
        <form
          action={handleAddGame}
          className='grid gap-4 px-2 mt-12'
          ref={formRef}>
          <h2 className='text-lg font-semibold'>Add Game</h2>
          <p className='text-sm font-light'>
            Add a game to the group librairy. You can rate it and add it to use
            it to create events to add to your group's calendar.
          </p>
          <div className='flex flex-col gap-4 mt-6'>
            <Input
              name='groupId'
              type='hidden'
              value={group.id}
            />
            <Input
              name='userId'
              type='hidden'
              value={loggedInUser.id}
            />
            <Label>Name *</Label>
            <Input
              name='name'
              type='text'
              required
            />
          </div>
          <div className='flex flex-col gap-4'>
            <Label>Description *</Label>
            <Textarea
              name='description'
              maxLength={288}
              className='h-48 resize-none'
              required
            />
          </div>

          <div className='flex gap-4'>
            <div className='flex flex-col gap-2'>
              <Label>Minimum players * </Label>
              <Input
                name='minPlayers'
                type='number'
                placeholder='2'
                required
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Label>Maximum players * </Label>
              <Input
                name='maxPlayers'
                type='number'
                placeholder='4'
                required
              />
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <Label>Image</Label>
            <Input
              name='image'
              type='file'
              accept='image/jpeg, image/png , image/jpg , image/gif'
            />
          </div>
          <Button className='mt-5'>
            {isPending ? <PulseLoader size={4} /> : "Add Game"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
