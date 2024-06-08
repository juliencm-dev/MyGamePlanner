import "server-only";

import { and, eq } from "drizzle-orm";
import { db } from "@/db/db";
import {
  Event,
  EventConfirmation,
  EventWithRelations,
  GroupMember,
  groupAvailableGames,
  groupEvents,
  groupEventsConfirmation,
} from "@/db/schema";
import {
  EventDto,
  EventConfirmationDto,
  Attendance,
} from "@/use-case/events/types";
import { getUserGroups } from "./group";
import { GroupDto } from "@/use-case/groups/types";
import { auth } from "@/auth";
import { group } from "console";

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

export async function createEvent({
  newEvent,
  attendance,
}: {
  newEvent: EventDto;
  attendance: EventConfirmationDto[];
}) {
  try {
    const event: Event = toEventMapper(newEvent);

    const res = await db.insert(groupEvents).values(event).returning();

    const confirmations: EventConfirmation[] = attendance.map((confirmation) =>
      toEventConfirmationMapper(confirmation, res[0].id)
    );

    await db.insert(groupEventsConfirmation).values(confirmations);
  } catch (error) {
    throw new Error("Could not create event");
  }
}

export async function deleteEvent({ eventId }: { eventId: string }) {
  try {
    await db.delete(groupEvents).where(eq(groupEvents.id, eventId));
  } catch (error) {
    throw new Error("Could not delete event");
  }
}

export async function updateEvent({
  eventId,
  updatedEvent,
}: {
  eventId: string;
  updatedEvent: EventDto;
}) {
  const event: Event = toEventMapper(updatedEvent);

  try {
    await db.update(groupEvents).set(event).where(eq(groupEvents.id, eventId));
  } catch (error) {
    throw new Error("Could not update event");
  }
}

export async function getUserEvents(): Promise<EventDto[]> {
  const { getUser } = await auth();
  const user = getUser();

  if (!user) throw new Error("User not authenticated");

  try {
    const groups: GroupDto[] = await getUserGroups();

    const eventsPromises = groups.map(async (group) => {
      if (group.id) {
        const result = await db.query.groupEvents.findMany({
          where: eq(groupEvents.groupId, group.id),
          with: {
            game: true,
            mandatoryPlayer: true,
            confirmations: true,
          },
        });
        return result;
      }
    });

    const filteredPromises = eventsPromises.filter(
      (promise) => promise !== undefined
    );

    const events: EventWithRelations[] = (
      await Promise.all(filteredPromises)
    ).flat() as EventWithRelations[];

    if (events.flat().length === 0) {
      return [];
    }

    return toEventDtoMapper(events);
  } catch (error) {
    console.error(error);
    throw new Error("Could not get events");
  }
}

export async function getEventsAndAttendanceByGroupId({
  groupId,
}: {
  groupId: string;
}): Promise<EventDto[]> {
  try {
    const events: EventWithRelations[] = (await db.query.groupEvents.findMany({
      where: eq(groupEvents.groupId, groupId),
      with: { game: true, mandatoryPlayer: true, confirmations: true },
    })) as EventWithRelations[];

    if (!events) {
      return [];
    }

    return toEventDtoMapper(events);
  } catch (error) {
    throw new Error("Could not get events");
  }
}

export async function getAttendanceByEventId({
  eventId,
}: {
  eventId: string;
}): Promise<EventConfirmationDto[]> {
  try {
    const confirmations: EventConfirmation[] =
      await db.query.groupEventsConfirmation.findMany({
        where: eq(groupEventsConfirmation.eventId, eventId),
      });

    return toEventConfirmationDtoMapper(confirmations);
  } catch (error) {
    throw new Error("Could not get attendance");
  }
}

export async function updateAttendanceByGroupId(groupId: string) {
  try {
    await db.transaction(async (trx) => {
      const events: Event[] = await trx.query.groupEvents.findMany({
        where: eq(groupEvents.groupId, groupId),
      });

      const members: GroupMember[] = await trx.query.groupMembers.findMany({
        where: eq(groupEvents.groupId, groupId),
      });

      const eventIds: string[] = events.map((event) => event.id);

      eventIds.forEach(async (eventId) => {
        members.forEach(async (member) => {
          await trx
            .insert(groupEventsConfirmation)
            .values({
              userId: member.userId,
              eventId: eventId,
            })
            .onConflictDoNothing();
        });
      });
    });
  } catch (error) {
    throw new Error("Could not update attendance");
  }
}

export async function updateUserAttendance(
  userAttendanceDto: EventConfirmationDto
) {
  try {
    await db
      .update(groupEventsConfirmation)
      .set({
        confirmed: userAttendanceDto.attending,
      })
      .where(
        and(
          eq(groupEventsConfirmation.userId, userAttendanceDto.userId),
          eq(groupEventsConfirmation.eventId, userAttendanceDto.eventId)
        )
      );
  } catch (error) {
    throw new Error("Could not update user attendance");
  }
}
