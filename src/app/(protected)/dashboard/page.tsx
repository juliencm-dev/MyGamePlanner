import { type EventDto } from "@/db/data-access/dto/events/types";
import { type UserDto } from "@/db/data-access/dto/users/types";
import { getUserEvents } from "@/db/data-access/events";
import { getCurrentUser } from "@/db/data-access/user";

import { ManageUserCalendar } from "@/components/dashboard/calendar/manage-user-calendar";
import { ManageUserInformation } from "@/components/dashboard/user-information/manage-user-information";
import { UserFavoriteGroups } from "@/components/dashboard/user-favorite-groups";
import { UserFavoriteGroupsList } from "@/components/dashboard/favorite-groups-list";

export default async function DashboardPage() {
  const events: EventDto[] = await getUserEvents();
  const user: UserDto = await getCurrentUser();

  return (
    <div className='container grid grid-cols-[1fr_1fr_1fr] gap-4'>
      <ManageUserCalendar
        events={events}
        user={user}
      />
      <ManageUserInformation />
      <UserFavoriteGroups>
        <UserFavoriteGroupsList />
      </UserFavoriteGroups>
    </div>
  );
}
