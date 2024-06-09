"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type UserDto } from "@/db/data-access/dto/users/types";
import { format } from "date-fns";

export function UpdateUserInformation({ userDto }: { userDto: UserDto }) {
  return (
    <>
      <div className='flex flex-col gap-2 mb-2'>
        <Label className='text-sm'>Display Name</Label>
        <Input
          className='bg-muted-foreground/10 border border-color-muted-foreground/10'
          placeholder={userDto.displayName ? userDto.displayName : userDto.name}
        />
      </div>
      <div className='flex flex-col gap-2 mb-2 '>
        <Label className='text-sm'>About Me</Label>
        <Textarea
          className='bg-muted-foreground/10 h-48 resize-none border border-color-muted-foreground/10'
          placeholder={
            userDto.aboutMe ? userDto.aboutMe : "Tell us about yourself"
          }
        />
      </div>
      <div className='flex gap-2 justify-between'>
        <div className='flex flex-col gap-2 mb-2'>
          <Label className='text-sm'>Member Since</Label>
          <Label className='text-sm font-light'>
            {format(userDto.createdAt, "MMM do, yyyy")}
          </Label>
        </div>
        <Button
          className='self-center h-10 w-32 hover:bg-green-800/80'
          variant={"outline"}>
          Save Profile
        </Button>
      </div>
    </>
  );
}
