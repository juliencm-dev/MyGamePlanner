export type EventDto = {
  id?: string;
  name: string;
  description: string;
  groupId: string;
  groupColor?: string;
  gameName?: string;
  gameId?: string;
  startDate: Date;
  endDate: Date;
  mandatoryPlayer?: string;
  confirmations: EventConfirmationDto[];
};

export type EventConfirmationDto = {
  userId: string;
  eventId: string;
  attending: Attendance;
};

export enum Attendance {
  CONFIRMED,
  PENDING,
  ABSENT,
}
