"use client";

import { type GroupDataProps, GroupProvider } from "@/context/group-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";
import { ManageGames } from "@/components/groups/games/manage-games";
import { ManageEvents } from "@/components/groups/events/manage-events";
import { LeaveGroupButton } from "@/components/groups/leave-group-button";
import { EventCalendar } from "@/components/groups/events/event-calendar";
import { ManageMembers } from "@/components/groups/members/manage-members";
import { DeleteGroupButton } from "@/components/groups/delete-group-button";

export function GroupClientWrapper({
  groupData,
}: {
  groupData: GroupDataProps;
}) {
  const { group, isAdmin, loggedInUser, inviteUrl } = groupData;
  const isOwner = group.ownerId === loggedInUser.id;

  return (
    <GroupProvider initialData={groupData}>
      <div className='container space-y-12'>
        <div className='flex flex-col gap-4 '>
          <h1 className='text-4xl font-semibold text-primary'>{group.name}</h1>
          <p>{group.description}</p>
          <div className='flex flex-col gap-2'>
            <Label className='text-lg'>Invite Link</Label>
            <div className='flex items-center gap-4'>
              <Input
                className='max-w-[400px] bg-muted-foreground/10 p-5'
                value={inviteUrl}
                readOnly
              />
              <CopyButton text={inviteUrl} />
            </div>
          </div>
          {isOwner && <DeleteGroupButton />}
          {!isAdmin && <LeaveGroupButton />}
        </div>
        <div className='grid grid-cols-[1fr_1fr_1fr] grid-rows-[2fr_1fr] gap-10'>
          <ManageMembers />
          <EventCalendar />
          {isAdmin && <ManageEvents />}
          <ManageGames />
        </div>
      </div>
    </GroupProvider>
  );
}
