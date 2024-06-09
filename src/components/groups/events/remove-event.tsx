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

  function handleRemoveEvent() {
    const formData = new FormData();
    formData.append("eventId", eventId);
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
        setSelectedEventId("");
        setSelectedEventName("");
      });
    });
  }

  return (
    <div>
      <Button
        variant={"destructive"}
        onClick={handleRemoveEvent}
        className='w-full'>
        {isPending ? <PulseLoader size={4} /> : "Remove Event"}
      </Button>
    </div>
  );
}
