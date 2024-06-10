"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { addGameAction } from "@/app/(protected)/groups/[groupId]/_actions/add-game";
import { useRef, useState, useTransition } from "react";
import { PulseLoader } from "react-spinners";
import { useToast } from "@/components/ui/use-toast";
import { type GroupDataProps, useGroup } from "@/context/group-context";
import { socket } from "@/components/websocket/socket";

export function AddGame({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const minPlayersRef = useRef<HTMLInputElement>(null);
  const maxPlayersRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const { group, loggedInUser } = useGroup() as GroupDataProps;
  const { toast } = useToast();

  function resetGameForm() {
    nameRef.current!.value = "";
    descriptionRef.current!.value = "";
    minPlayersRef.current!.value = "";
    maxPlayersRef.current!.value = "";
    imageRef.current!.value = "";
  }

  function handleAddGame() {
    const formData = new FormData();

    formData.append("name", nameRef.current?.value as string);
    formData.append("description", descriptionRef.current?.value as string);
    formData.append("minPlayers", minPlayersRef.current?.value as string);
    formData.append("maxPlayers", maxPlayersRef.current?.value as string);
    formData.append("image", imageRef.current?.files?.[0] as File);
    formData.append("groupId", group.id as string);
    formData.append("userId", loggedInUser.id as string);

    startTransition(async () => {
      await addGameAction(formData).then((res) => {
        if (res.status === 200) {
          toast({
            title: "Success",
            description: res.message,
          });

          setOpen(false);
          socket.emit("groupUpdate", { target: group.id });
          resetGameForm();
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: res.message,
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
        <div className='grid gap-4 px-2 mt-12'>
          <h2 className='text-lg font-semibold'>Add Game</h2>
          <p className='text-sm font-light'>
            {`Add a game to the group librairy. You can rate it and add it to use
            it to create events to add to your group's calendar.`}
          </p>
          <div className='flex flex-col gap-4 mt-6'>
            <Label>Name *</Label>
            <Input
              name='name'
              type='text'
              ref={nameRef}
              required
            />
          </div>
          <div className='flex flex-col gap-4'>
            <Label>Description *</Label>
            <Textarea
              name='description'
              maxLength={288}
              ref={descriptionRef}
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
                ref={minPlayersRef}
                placeholder='2'
                required
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Label>Maximum players * </Label>
              <Input
                name='maxPlayers'
                type='number'
                ref={maxPlayersRef}
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
              ref={imageRef}
              accept='image/jpeg, image/png , image/jpg , image/gif'
            />
          </div>
          <Button
            onClick={handleAddGame}
            className='mt-5'>
            {isPending ? <PulseLoader size={4} /> : "Add Game"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
