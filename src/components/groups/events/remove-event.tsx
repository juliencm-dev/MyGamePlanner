"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "sonner";
import { removeEventAction } from "@/app/(protected)/groups/[groupId]/_actions/remove-event";

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

  function handleRemoveEvent(formData: FormData) {
    startTransition(async () => {
      await removeEventAction(formData).then((res) => {
        if (res) {
          toast("Success", {
            description: res.message,
          });
          setSelectedEventId("");
          setSelectedEventName("");
        } else {
          toast.error("Error", {
            description: "Could not remove event from group",
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
