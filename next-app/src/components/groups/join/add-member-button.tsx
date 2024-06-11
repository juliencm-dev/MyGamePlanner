"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { PulseLoader } from "react-spinners";
import { addMemberToGroupAction } from "@/app/(public)/join/_actions/add-member-to-group";
import { useRouter } from "next/navigation";
import { useSocketConnection } from "@/components/websocket/useSocketConnection";
import { socket } from "@/components/websocket/socket";

export type NotificationProps = {
  message: any;
  sender: string;
  receivers: string[];
  target: string;
};

export function AddMemberButton({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) {
  useSocketConnection();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleJoinGroup() {
    startTransition(async () => {
      const res = await addMemberToGroupAction(groupId, userId);
      if (res.status !== 201) {
        console.error("Failed to join group");
        return;
      }

      if (res.notification) {
        socket.emit("notification", res.notification);
        socket.emit("joinGroup", groupId);
      }
    });

    router.push(`/groups/${groupId}`);
  }

  return (
    <Button
      disabled={isPending}
      className='w-full'
      onClick={handleJoinGroup}>
      {isPending ? <PulseLoader size={5} /> : "Join Group"}
    </Button>
  );
}
