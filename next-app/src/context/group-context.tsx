import React, { createContext, useContext } from "react";
import { type EventDto } from "@/db/data-access/dto/events/types";
import { type GameDto } from "@/db/data-access/dto/games/types";
import {
  type GroupDto,
  type GroupMemberDto,
} from "@/db/data-access/dto/groups/types";
import { type UserDto } from "@/db/data-access/dto/users/types";

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
