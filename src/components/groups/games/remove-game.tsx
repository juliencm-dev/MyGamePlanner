"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "sonner";
import { removeGameAction } from "@/app/(protected)/groups/[groupId]/_actions/remove-game";

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

  function handleRemoveGame(formData: FormData) {
    startTransition(async () => {
      await removeGameAction(formData).then((res) => {
        if (res) {
          toast("Success", {
            description: res.message,
          });
          setSelectedGameId("");
          setSelectedGameName("");
        } else {
          toast.error("Error", {
            description: "Could not remove game from group",
          });
        }
      });
    });
  }

  return (
    <form action={handleRemoveGame}>
      <Input
        name='gameId'
        type='hidden'
        value={gameId}
      />
      <Button
        variant={"destructive"}
        className='w-full'>
        {isPending ? <PulseLoader size={4} /> : "Remove Game"}
      </Button>
    </form>
  );
}
