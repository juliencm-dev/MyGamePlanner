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
import { type GroupMemberDto } from "@/use-case/groups/types";
import { useTransition } from "react";
import { removeMemberAction } from "@/app/(protected)/groups/[groupId]/_actions/remove-member";
import { ServerResponseMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { type GroupDataProps, useGroup } from "@/context/group-context";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export function LeaveGroupButton({ className }: { className?: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const { members, loggedInUser } = useGroup() as GroupDataProps;
  const [isPending, startTransition] = useTransition();

  const groupMember: GroupMemberDto = members.find(
    (member: GroupMemberDto) => member.id === loggedInUser.id
  ) as GroupMemberDto;

  function handleLeaveGroup() {
    startTransition(async () => {
      await removeMemberAction(groupMember).then(
        (res: ServerResponseMessage) => {
          if (res.status === 200) {
            toast({
              title: "Success",
              description: res.message,
            });
            router.push("/groups");
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
        <div>
          <Button
            variant={"destructive"}
            className={cn(className, "text-sm")}>
            Leave Group
          </Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to leave the group?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. You will lose access to the group's
            games, events, and members.
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
