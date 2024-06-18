"use client";

import { updateUserAvatarAction } from "@/app/(protected)/dashboard/_action/update-user-avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { UploadDropzone } from "@/components/uploadthing/utils";
import { socket } from "@/components/websocket/socket";
import { GroupDto } from "@/db/data-access/dto/groups/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdateUserAvatar({ children, groups }: { children: React.ReactNode; groups: GroupDto[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleUpdateAvatar(url: string) {
    await updateUserAvatarAction(url).then(res => {
      if (res.status === 200) {
        toast({
          title: "Success",
          description: res.message,
          duration: 2500,
        });
        groups.forEach(group => {
          socket.emit("groupUpdate", { target: group.id });
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.message,
        });
      }
    });

    router.refresh();
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent side="right">
        <div className="grid gap-10 px-2 mt-12">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Update your avatar</h2>
            <p className="text-sm font-light">{"You can upload a new image in order to change your current avatar."}</p>
          </div>
          <div className="border border-sm rounded-lg">
            <UploadDropzone
              className="ut-label:text-secondary ut-button:bg-primary ut-button:w-full ut-button:text-primary-foreground"
              endpoint="imageUploader"
              onClientUploadComplete={res => {
                handleUpdateAvatar(res[0].url);
              }}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
