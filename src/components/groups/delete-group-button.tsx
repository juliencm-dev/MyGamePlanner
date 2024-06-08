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
import { toast } from "sonner";
import { type ServerResponseMessage } from "@/lib/types";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { type GroupDataProps, useGroup } from "@/context/group-context";
import { deleteGroupAction } from "@/app/(protected)/groups/[groupId]/_actions/delete-group";

export function DeleteGroupButton({ className }: { className?: string }) {
  const router = useRouter();
  const { group } = useGroup() as GroupDataProps;
  const [isPending, startTransition] = useTransition();

  function handleLeaveGroup() {
    startTransition(async () => {
      await deleteGroupAction(group).then((res: ServerResponseMessage) => {
        if (res) {
          toast("Success", {
            description: res.message,
          });
          router.push("/groups");
        } else {
          toast.error("Error", {
            description: "Could not delete group",
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
