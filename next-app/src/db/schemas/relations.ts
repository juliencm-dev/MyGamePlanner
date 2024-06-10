import { relations } from "drizzle-orm";
import {
  users,
  groupMembers,
  groups,
  memberAbsence,
  memberAvailability,
  userFavoriteGroups,
  groupAvailableGames,
  groupGameRating,
  groupEvents,
  groupEventsConfirmation,
} from "@/db/schema";

export const userRelations = relations(users, ({ many }) => ({
  availability: many(memberAvailability),
  absences: many(memberAbsence),
}));

export const groupRelations = relations(groups, ({ one, many }) => ({
  owner: one(users, {
    fields: [groups.ownerId],
    references: [users.id],
  }),
  members: many(groupMembers),
  favoriteUsers: many(userFavoriteGroups),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupMembers.userId],
    references: [users.id],
  }),
}));

export const groupAvailableGamesRelations = relations(
  groupAvailableGames,
  ({ one }) => ({
    addedBy: one(users, {
      fields: [groupAvailableGames.addedBy],
      references: [users.id],
    }),
    group: one(groups, {
      fields: [groupAvailableGames.groupId],
      references: [groups.id],
    }),
  })
);

export const groupGameRatingRelations = relations(
  groupGameRating,
  ({ one }) => ({
    game: one(groupAvailableGames, {
      fields: [groupGameRating.gameId],
      references: [groupAvailableGames.id],
    }),
    user: one(users, {
      fields: [groupGameRating.userId],
      references: [users.id],
    }),
  })
);

export const groupEventsRelations = relations(groupEvents, ({ one, many }) => ({
  group: one(groups, {
    fields: [groupEvents.groupId],
    references: [groups.id],
  }),
  game: one(groupAvailableGames, {
    fields: [groupEvents.game],
    references: [groupAvailableGames.id],
  }),
  mandatoryPlayer: one(users, {
    fields: [groupEvents.mandatoryPlayer],
    references: [users.id],
  }),
  confirmations: many(groupEventsConfirmation),
}));

export const groupEventsConfirmationRelations = relations(
  groupEventsConfirmation,
  ({ one }) => ({
    event: one(groupEvents, {
      fields: [groupEventsConfirmation.eventId],
      references: [groupEvents.id],
    }),
    user: one(users, {
      fields: [groupEventsConfirmation.userId],
      references: [users.id],
    }),
  })
);

export const memberAvailabilityRelation = relations(
  memberAvailability,
  ({ one }) => ({
    user: one(users, {
      fields: [memberAvailability.userId],
      references: [users.id],
    }),
  })
);

export const memberAbsenceRelation = relations(memberAbsence, ({ one }) => ({
  user: one(users, {
    fields: [memberAbsence.userId],
    references: [users.id],
  }),
}));
