"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { PulseLoader } from "react-spinners";
import { removeEventAction } from "@/app/(protected)/groups/[groupId]/_actions/remove-event";
import { useToast } from "@/components/ui/use-toast";

export function RemoveEvent({
  eventId,
  setSelectedEventId,
  setSelectedEventName,
}: {
  eventId: string;
  setSelectedEventId: (id: string) => void;
  setSelectedEventName: (name: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function handleRemoveEvent(formData: FormData) {
    startTransition(async () => {
      await removeEventAction(formData).then((res) => {
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
    <form action={handleRemoveEvent}>
      <Input
        name='eventId'
        type='hidden'
        value={eventId}
      />
      <Button
        variant={"destructive"}
        className='w-full'>
        {isPending ? <PulseLoader size={4} /> : "Remove Event"}
      </Button>
    </form>
  );
}
