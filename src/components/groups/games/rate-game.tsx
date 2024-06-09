"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { StarRating } from "@/components/groups/games/star-rating";
import { useState, useTransition } from "react";
import { PulseLoader } from "react-spinners";
import Image from "next/image";
import { type RatingDto } from "@/db/data-access/dto/games/types";
import { addGameRatingAction } from "@/app/(protected)/groups/[groupId]/_actions/add-game-rating";
import { useToast } from "@/components/ui/use-toast";

export type SelectedGame = {
  id: string;
  name: string;
  image?: string;
};

export function RateGame({
  children,
  selectedGame,
  userId,
}: {
  children: React.ReactNode;
  selectedGame: SelectedGame;
  userId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(0);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmitRating = () => {
    const newRating: RatingDto = {
      gameId: selectedGame.id,
      userId: userId,
      rating: rating,
    };

    startTransition(async () => {
      await addGameRatingAction(newRating).then((res) => {
        if (res.status === 200) {
          toast({
            title: "Success",
            description: res.message,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: res.message,
          });
        }
      });
    });
  };

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className='flex flex-col mx-auto w-full max-w-sm space-y-4'>
          <DrawerHeader className='grid place-items-center'>
            <DrawerTitle className='text-3xl'>Rate Game</DrawerTitle>
            <DrawerDescription className='text-lg'>
              {selectedGame.name}
            </DrawerDescription>
          </DrawerHeader>
          {selectedGame.image && (
            <Image
              src={selectedGame.image}
              width={200}
              height={200}
              alt={selectedGame.name}
              className='self-center rounded-lg'
            />
          )}
          <div className='self-center'>
            <StarRating
              setRating={setRating}
              rating={rating}
            />
          </div>
          <DrawerFooter>
            <Button
              disabled={isPending}
              onClick={handleSubmitRating}>
              {isPending ? <PulseLoader size={4} /> : "Submit"}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
