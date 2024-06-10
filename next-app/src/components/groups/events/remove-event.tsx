"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { PulseLoader } from "react-spinners";
import { removeEventAction } from "@/app/(protected)/groups/[groupId]/_actions/remove-event";
import { useToast } from "@/components/ui/use-toast";
import { type GroupDataProps, useGroup } from "@/context/group-context";
import { socket } from "@/components/websocket/socket";

export function RemoveEvent({
  eventId,
  setSelectedEventId,
  setSelectedEventName,
}: {
  eventId: string;
  setSelectedEventId: (id: string) => void;
  setSelectedEventName: (name: string) => void;
}) {
  const { group } = useGroup() as GroupDataProps;
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
          socket.emit("groupUpdate", { target: group.id });
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
