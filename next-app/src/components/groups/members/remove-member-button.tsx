"use client";

import { useToast } from "@/components/ui/use-toast";
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
import { type GroupMemberDto } from "@/db/data-access/dto/groups/types";
import { removeMemberAction } from "@/app/(protected)/groups/[groupId]/_actions/remove-member";
import { socket } from "@/components/websocket/socket";

export function RemoveMemberButton({
  groupMemberDto,
  setSelected,
  className,
}: {
  groupMemberDto: GroupMemberDto;
  setSelected: (value: string | null) => void;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  async function handleRemoveMember() {
    startTransition(async () => {
      await removeMemberAction(groupMemberDto).then(
        (res: ServerResponseMessage) => {
          setSelected(null);

          if (res.status === 200) {
            toast({
              title: "Success",
              description: res.message,
            });

            socket.emit("leaveGroup", {
              groupId: groupMemberDto.groupId,
              userId: groupMemberDto.id,
            });

            socket.emit("removeFromGroup", {
              userId: groupMemberDto.id,
            });
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: res.message,
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
