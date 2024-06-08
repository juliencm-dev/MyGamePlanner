import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { redirect } from "next/navigation";
import { GroupDto } from "@/use-case/groups/types";
import { getGroupByToken } from "@/data-access/group";
import { AddMemberButton } from "@/components/groups/join/add-member-button";
import { auth } from "@/auth";

export default async function JoinGroupPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const token = searchParams.token;
  const { getUser } = await auth();
  const user = getUser();

  if (!token) return redirect("/");

  if (!user) {
    return redirect("/");
  }

  let group: GroupDto;
  try {
    group = await getGroupByToken(token);
  } catch (e) {
    return redirect("/");
  }

  return (
    <div className='h-screen grid place-items-center'>
      <Card className='w-[550px]'>
        <CardHeader className='grid place-items-center gap-2'>
          <Avatar className='w-24 h-24'>
            <AvatarImage />
            <AvatarFallback className='text-3xl'>G</AvatarFallback>
          </Avatar>
          <CardDescription>
            You have been invited to join a group.
          </CardDescription>
          <CardTitle className='text-2xl'>{group.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='my-4 text-center'>{group.description}</div>
        </CardContent>
        <CardFooter>
          <AddMemberButton
            groupId={group.id as string}
            userId={user.id}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
