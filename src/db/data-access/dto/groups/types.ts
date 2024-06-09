import { UserAbsenceDto, UserAvailabilityDto } from "@/dto/users/types";

export type GroupDto = {
  id?: string;
  name: string;
  description: string;
  image?: string;
  isFavourite?: boolean;
  ownerId: string;
};

export type GroupMemberDto = {
  name: string;
  image: string;
  role: "Group Owner" | "Member" | "Admin";
  id: string;
  groupId: string;
  availability?: UserAvailabilityDto[];
  absences?: UserAbsenceDto[];
};

export type GroupInviteTokenDto = {
  expires: Date;
  token: string;
};

export type UpdateMemberDto = {
  userId: string;
  groupId: string;
  role: "Group Owner" | "Member" | "Admin";
};
