import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { type GroupDto } from "@/use-case/groups/types";
import { GroupCard } from "@/components/groups/group-card";
import { getUserFavoriteGroups } from "@/data-access/user";

export async function UserFavoriteGroupsList() {
  const favoriteGroups: GroupDto[] = await getUserFavoriteGroups();

  return (
    <>
      {favoriteGroups.length === 0 ? (
        <Label className='p-4 text-muted-foreground flex gap-4'>
          <ExclamationTriangleIcon className='w-6 h-6 text-yellow-500' />
          <div className='self-center'>
            No favorite groups found. Add some groups to your favorites via the
            groups page.
          </div>
        </Label>
      ) : (
        <div className='grid grid-cols-4 gap-4 w-full place-items-center'>
          {favoriteGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              inFavorites={true}
            />
          ))}
        </div>
      )}
    </>
  );
}
