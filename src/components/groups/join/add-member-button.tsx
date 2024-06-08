"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { PulseLoader } from "react-spinners";
import { addMemberToGroupAction } from "@/app/(public)/join/_actions/add-member-to-group";
import { useRouter } from "next/navigation";

export function AddMemberButton({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleJoinGroup() {
    startTransition(async () => {
      addMemberToGroupAction(groupId, userId).then((res) => {
        if (res.status !== 201) {
          console.error("Failed to join group");
          return;
        }
      });
    });

    router.push("/groups");
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
