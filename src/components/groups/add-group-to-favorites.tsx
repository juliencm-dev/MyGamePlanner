"use client";

import { addFavoriteAction } from "@/app/(protected)/groups/_actions/add-favorite";
import { removeFavoriteAction } from "@/app/(protected)/groups/_actions/remove-favorite";
import { type GroupDto } from "@/use-case/groups/types";
import { StarIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function AddGroupToFavorites({ group }: { group: GroupDto }) {
  const [isFavorite, setIsFavorite] = useState(group.isFavourite);
  const { toast } = useToast();

  async function handleAddFavorite() {
    await addFavoriteAction({ groupId: group.id as string }).then((res) => {
      if (res.status === 200) {
        toast({
          title: "Success",
          description: res.message,
        });
        setIsFavorite(true);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.message,
        });
      }
    });
  }

  async function handleRemoveFavorite() {
    await removeFavoriteAction({ groupId: group.id as string }).then((res) => {
      if (res.status === 200) {
        toast({
          title: "Success",
          description: res.message,
        });
        setIsFavorite(false);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.message,
        });
      }
    });
  }

  if (isFavorite) {
    return (
      <StarFilledIcon
        className='absolute w-10 h-10 cursor-pointer bottom-4 right-4 text-yellow-500/80 hover:text-yellow-500 transition-colors duration-200'
        onClick={handleRemoveFavorite}
      />
    );
  }

  return (
    <StarIcon
      className='absolute w-10 h-10 cursor-pointer bottom-4 right-4 text-muted-foreground hover:text-yellow-500 transition-colors duration-200'
      onClick={handleAddFavorite}
    />
  );
}
