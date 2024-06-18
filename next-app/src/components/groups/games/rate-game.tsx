"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
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

type RateGameProps = {
  children: React.ReactNode;
  selectedGame: SelectedGame;
  userId: string;
};

export function RateGame(props: RateGameProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmitRating = async () => {
    const newRating: RatingDto = {
      gameId: props.selectedGame.id,
      userId: props.userId,
      rating: rating,
    };

    setIsLoading(true);

    await addGameRatingAction(newRating).then(res => {
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

    setIsLoading(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{props.children}</DrawerTrigger>
      <DrawerContent>
        <div className="flex flex-col mx-auto w-full max-w-sm space-y-4">
          <DrawerHeader className="grid place-items-center">
            <DrawerTitle className="text-3xl">Rate Game</DrawerTitle>
            <DrawerDescription className="text-lg">{props.selectedGame.name}</DrawerDescription>
          </DrawerHeader>
          {props.selectedGame.image && <Image src={props.selectedGame.image} width={200} height={200} alt={props.selectedGame.name} className="self-center rounded-lg" />}
          <div className="self-center">
            <StarRating setRating={setRating} rating={rating} />
          </div>
          <DrawerFooter>
            <Button disabled={isLoading} onClick={handleSubmitRating}>
              {isLoading ? <PulseLoader size={4} /> : "Submit"}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
