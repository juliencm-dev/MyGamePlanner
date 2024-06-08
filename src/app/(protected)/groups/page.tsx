import { CreateGroupButton } from "@/components/groups/create-group";
import { getUserGroups } from "@/data-access/group";
import { type GroupDto } from "@/use-case/groups/types";
import { GroupCard } from "@/components/groups/group-card";

export default async function GroupsPage() {
  const groups: GroupDto[] = await getUserGroups();

  return (
    <div className='container flex flex-wrap gap-4'>
      <CreateGroupButton />
      {groups.map((group: GroupDto) => (
        <GroupCard
          key={group.id}
          group={group}
        />
      ))}
    </div>
  );
}
