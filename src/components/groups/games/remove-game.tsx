"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "sonner";
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

  function handleRemoveGame(formData: FormData) {
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
