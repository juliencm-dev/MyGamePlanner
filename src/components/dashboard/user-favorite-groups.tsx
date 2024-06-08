import { Suspense } from "react";
import { GroupCardLoading } from "@/components/groups/group-card-loading";

export async function UserFavoriteGroups({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <fieldset className={`col-span-3 flex border p-4 rounded-lg`}>
      <legend className='text-lg px-1'>Favourite Groups</legend>
      <Suspense fallback={<GroupCardLoading />}>{children}</Suspense>
    </fieldset>
  );
}
