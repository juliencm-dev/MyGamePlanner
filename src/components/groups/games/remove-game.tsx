"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { PulseLoader } from "react-spinners";
import { removeGameAction } from "@/app/(protected)/groups/[groupId]/_actions/remove-game";
import { useToast } from "@/components/ui/use-toast";

export function RemoveGame({
  gameId,
  setSelectedGameId,
  setSelectedGameName,
}: {
  gameId: string;
  setSelectedGameId: (id: string) => void;
  setSelectedGameName: (name: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function handleRemoveGame() {
    const formData = new FormData();
    formData.append("gameId", gameId);
    startTransition(async () => {
      await removeGameAction(formData).then((res) => {
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
        setSelectedGameId("");
        setSelectedGameName("");
      });
    });
  }

  return (
    <div>
      <Button
        variant={"destructive"}
        onClick={handleRemoveGame}
        className='w-full'>
        {isPending ? <PulseLoader size={4} /> : "Remove Game"}
      </Button>
    </div>
  );
}
