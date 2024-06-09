import React, { createContext, useContext } from "react";
import { EventDto } from "@/use-case/events/types";
import { GameDto } from "@/use-case/games/types";
import { GroupDto, GroupMemberDto } from "@/use-case/groups/types";
import { UserDto } from "@/use-case/users/types";

export type GroupDataProps = {
  group: GroupDto;
  members: GroupMemberDto[];
  games: GameDto[];
  events: EventDto[];
  loggedInUser: UserDto;
  inviteUrl: string;
  isAdmin: boolean;
};

const GroupContext = createContext<GroupDataProps | undefined>(undefined);

export function useGroup() {
  return useContext(GroupContext);
}

export const GroupProvider = ({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: GroupDataProps;
}) => {
  return (
    <GroupContext.Provider value={initialData}>
      {children}
    </GroupContext.Provider>
  );
};
