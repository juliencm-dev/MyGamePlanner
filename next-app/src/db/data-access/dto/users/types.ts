export type UserDto = {
  id: string;
  name: string;
  displayName: string;
  createdAt: Date;
  aboutMe: string;
  email: string;
  image: string;
  absences: UserAbsenceDto[];
  availabilities: UserAvailabilityDto[];
};

export type UserAvailabilityDto = {
  userId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export type UserAbsenceDto = {
  userId: string;
  startDate: Date;
  endDate: Date;
};

export type UserDetails = {
  displayName?: string;
  aboutMe?: string;
};
