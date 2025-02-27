"use client";

import { updateUserAvatarAction } from "@/app/(protected)/dashboard/_action/update-user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { socket } from "@/components/websocket/socket";
import { GroupDto } from "@/db/data-access/dto/groups/types";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { PulseLoader } from "react-spinners";

export function UpdateUserAvatar({ children, groups }: { children: React.ReactNode; groups: GroupDto[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  function handleIsImgEmpty() {
    setIsEmpty(!imageRef.current?.files?.length);
  }

  async function handleUpdateAvatar() {
    const formData = new FormData();
    const imgFile = imageRef.current?.files?.[0];
    formData.append("image", imgFile as File);

    setIsLoading(true);
    await updateUserAvatarAction(formData).then(res => {
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
    setIsLoading(false);
    setOpen(false);
    setIsEmpty(true);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent side="right">
        <div className="grid gap-4 px-2 mt-12">
          <h2 className="text-lg font-semibold">Update your avatar</h2>
          <p className="text-sm font-light">{`Upload a new avatar.`}</p>
          <div className="flex flex-col gap-4 mt-6">
            <Label>Avatar file</Label>
            <Input name="image" type="file" ref={imageRef} onChange={handleIsImgEmpty} required />
          </div>
          <Button onClick={handleUpdateAvatar} className="mt-5" disabled={isEmpty}>
            {isLoading ? <PulseLoader size={4} /> : "Update Avatar"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
