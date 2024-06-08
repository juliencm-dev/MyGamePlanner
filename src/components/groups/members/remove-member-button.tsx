"use client";

import { toast } from "sonner";
import { type ServerResponseMessage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTransition } from "react";
import { type GroupMemberDto } from "@/use-case/groups/types";
import { removeMemberAction } from "@/app/(protected)/groups/[groupId]/_actions/remove-member";

export function RemoveMemberButton({
  groupMemberDto,
  className,
}: {
  groupMemberDto: GroupMemberDto;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();

  async function handleRemoveMember() {
    startTransition(async () => {
      await removeMemberAction(groupMemberDto).then(
        (res: ServerResponseMessage) => {
          if (res) {
            toast("Success", {
              description: res.message,
            });
          } else {
            toast.error("Error", {
              description: "Could not remove member from group",
            });
          }
        }
      );
    });
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"}>Remove From Group</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {"Are you sure you want to remove "}
            <span className='text-red-500 font-bold text-center'>
              {groupMemberDto.name}
            </span>
            {" from the group?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {"This action cannot be undone. "}
            {groupMemberDto.name}
            {" will lose access to the group's games, events, and members."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={handleRemoveMember}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
