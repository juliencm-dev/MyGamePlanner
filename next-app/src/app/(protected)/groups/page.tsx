import { CreateGroupButton } from "@/components/groups/create-group";
import { getUserGroups } from "@/db/data-access/groups";
import { type GroupDto } from "@/db/data-access/dto/groups/types";
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
