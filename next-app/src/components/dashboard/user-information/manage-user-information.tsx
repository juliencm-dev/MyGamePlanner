import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarUpdateButton } from "@/components/dashboard/user-information/avatar-update-button";
import { UpdateUserInformation } from "@/components/dashboard/user-information/update-user-information";
import { Label } from "@/components/ui/label";
import { type UserDto } from "@/db/data-access/dto/users/types";
import { getCurrentUser } from "@/db/data-access/users";
import { UpdateUserAvatar } from "@/components/dashboard/user-information/update-user-avatar";
import { GroupDto } from "@/db/data-access/dto/groups/types";

export async function ManageUserInformation({ groups }: { groups: GroupDto[] }) {
  const userDto: UserDto = await getCurrentUser();
  return (
    <fieldset className="flex flex-col gap-4 border p-4 rounded-lg">
      <legend className="text-lg px-1">User Informations</legend>
      <div className="flex gap-4 border rounded-lg p-4 bg-muted-foreground/10">
        <UpdateUserAvatar groups={groups}>
          <AvatarUpdateButton className="w-20 h-20 rounded-full">
            <Avatar className="w-20 h-20 z-0">
              <AvatarImage src={userDto.image as string} />
              <AvatarFallback className="text-xl">{userDto.name[0]}</AvatarFallback>
            </Avatar>
          </AvatarUpdateButton>
        </UpdateUserAvatar>
        <div className="flex flex-col gap-1 self-center">
          <Label className="text-md font-semibold">{userDto.name}</Label>
          <Label className="text-sm font-extralight">{userDto.email}</Label>
        </div>
      </div>
      <UpdateUserInformation userDto={userDto} />
    </fieldset>
  );
}
