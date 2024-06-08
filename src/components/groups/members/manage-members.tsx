import { MemberList } from "@/components/groups/members/member-list";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ManageMembers() {
  return (
    <fieldset className='flex flex-col gap-2 border p-4 rounded-lg cols-span-1 row-span-2'>
      <legend className='text-lg px-1'>Group Members</legend>
      <ScrollArea>
        <MemberList />
      </ScrollArea>
    </fieldset>
  );
}
