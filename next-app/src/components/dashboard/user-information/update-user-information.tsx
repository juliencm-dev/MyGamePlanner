"use client";

import { updateUserDetailsAction } from "@/app/(protected)/dashboard/_action/update-user-details";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { UserDetails, type UserDto } from "@/db/data-access/dto/users/types";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { PulseLoader } from "react-spinners";

export function UpdateUserInformation({ userDto }: { userDto: UserDto }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [formKey, setFormKey] = useState(0);
  const [isFormEmpty, setIsFormEmpty] = useState(true);
  const displayNameRef = useRef<HTMLInputElement>(null);
  const aboutMeRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsFormEmpty(!displayNameRef.current?.value.trim() && !aboutMeRef.current?.value.trim());
  }, []);

  const handleIsFormEmpty = () => {
    setIsFormEmpty(!displayNameRef.current?.value.trim() && !aboutMeRef.current?.value.trim());
  };

  const handleUpdateUserInformations = async () => {
    const userDetails: UserDetails = {
      displayName: displayNameRef.current?.value.trim() || undefined,
      aboutMe: aboutMeRef.current?.value.trim() || undefined,
    };
    startTransition(async () => {
      await updateUserDetailsAction({ userDetails }).then(res => {
        if (res.status === 200) {
          toast({
            title: "Success",
            description: res.message,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: res.message,
          });
        }
      });
    });
    router.refresh();
    setFormKey(prevKey => prevKey + 1);
  };

  useEffect(() => {
    if (displayNameRef.current) displayNameRef.current.value = "";
    if (aboutMeRef.current) aboutMeRef.current.value = "";
    handleIsFormEmpty();
  }, [formKey]);

  return (
    <form key={formKey}>
      <div className="flex flex-col gap-2 mb-2">
        <Label className="text-sm">Display Name</Label>
        <Input onChange={handleIsFormEmpty} ref={displayNameRef} className="bg-muted-foreground/10 border border-color-muted-foreground/10" placeholder={userDto.displayName || userDto.name} />
      </div>
      <div className="flex flex-col gap-2 mb-2">
        <Label className="text-sm">About Me</Label>
        <Textarea onChange={handleIsFormEmpty} ref={aboutMeRef} className="bg-muted-foreground/10 h-48 resize-none border border-color-muted-foreground/10" placeholder={userDto.aboutMe || "Tell us about yourself"} />
      </div>
      <div className="flex gap-2 justify-between">
        <div className="flex flex-col gap-2 mb-2">
          <Label className="text-sm">Member Since</Label>
          <Label className="text-sm font-light">{format(userDto.createdAt, "MMM do, yyyy")}</Label>
        </div>
        <Button onClick={handleUpdateUserInformations} className="self-center h-10 w-32 hover:bg-secondary" variant={"gooeyLeft"} disabled={isPending || isFormEmpty}>
          {isPending ? <PulseLoader size={4} /> : "Save Profile"}
        </Button>
      </div>
    </form>
  );
}
