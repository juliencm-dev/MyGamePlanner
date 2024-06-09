"use client";

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

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { type ServerResponseMessage } from "@/lib/types";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { type GroupDataProps, useGroup } from "@/context/group-context";
import { deleteGroupAction } from "@/app/(protected)/groups/[groupId]/_actions/delete-group";
import { useToast } from "@/components/ui/use-toast";
import { socket } from "@/components/websocket/socket";

export function DeleteGroupButton({ className }: { className?: string }) {
  const { group } = useGroup() as GroupDataProps;
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  function handleLeaveGroup() {
    startTransition(async () => {
      await deleteGroupAction(group).then((res: ServerResponseMessage) => {
        if (res.status === 200) {
          toast({
            title: "Success",
            description: res.message,
          });
          socket.emit("groupUpdate", { target: group.id });
          router.push("/groups");
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div>
          <Button
            variant={"destructive"}
            className={cn(className, "text-sm")}>
            Delete Group
          </Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this group?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. You will lose all data related to the
            group's games, events, and members.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={handleLeaveGroup}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
