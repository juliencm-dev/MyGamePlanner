import { EventConfirmation, EventWithRelations, Event } from "@/db/schema";
import {
  Attendance,
  EventConfirmationDto,
  EventDto,
} from "@/use-case/events/types";

export function toEventDtoMapper(events: EventWithRelations[]): EventDto[] {
  return events.map((event) => {
    return {
      id: event.id,
      name: event.name,
      description: event.description,
      groupId: event.groupId,
      gameName: event.game.name,
      startDate: event.startDate,
      endDate: event.endDate,
      mandatoryPlayer: event.mandatoryPlayer || null,
      confirmations: toEventConfirmationDtoMapper(event.confirmations),
    } as EventDto;
  });
}

export function toEventMapper(event: EventDto): Event {
  return {
    id: event.id,
    name: event.name,
    description: event.description,
    groupId: event.groupId,
    game: event.gameId,
    startDate: event.startDate,
    endDate: event.endDate,
    mandatoryPlayer: event.mandatoryPlayer || null,
  } as Event;
}

export function toEventConfirmationDtoMapper(
  eventConfirmations: EventConfirmation[]
): EventConfirmationDto[] {
  return eventConfirmations.map((confirmation) => {
    return {
      userId: confirmation.userId,
      eventId: confirmation.eventId,
      attending: confirmation.confirmed as Attendance,
    } as EventConfirmationDto;
  });
}

export function toEventConfirmationMapper(
  eventConfirmation: EventConfirmationDto,
  eventId: string
): EventConfirmation {
  return {
    userId: eventConfirmation.userId,
    eventId: eventId,
    confirmed:
      (eventConfirmation.attending?.valueOf() as number) || Attendance.PENDING,
  } as EventConfirmation;
}
