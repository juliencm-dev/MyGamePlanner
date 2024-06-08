import {
  timestamp,
  pgTable,
  text,
  integer,
  primaryKey,
  pgEnum,
  varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { createId } from "@paralleldrive/cuid2";
import {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
  relations,
} from "drizzle-orm";

import * as schema from "./schema";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>["with"];

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

export const groupRole = pgEnum("role", ["Group Owner", "Admin", "Member"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  displayName: text("displayName"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  aboutMe: text("aboutMe"),
  image: text("image"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  favoriteGroups: many(userFavoriteGroups),
  accounts: many(accounts),
  availability: many(memberAvailability),
  absences: many(memberAbsence),
}));

export const userFavoriteGroups = pgTable(
  "userFavoriteGroup",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    groupId: text("groupId")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
  },
  (ufg) => ({
    compoundKey: primaryKey({ columns: [ufg.userId, ufg.groupId] }),
  })
);

const userFavoriteGroupsRelations = relations(
  userFavoriteGroups,
  ({ one }) => ({
    user: one(users, {
      fields: [userFavoriteGroups.userId],
      references: [users.id],
    }),
    group: one(groups, {
      fields: [userFavoriteGroups.groupId],
      references: [groups.id],
    }),
  })
);

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const groups = pgTable("group", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  description: varchar("description", { length: 144 }),
  image: text("image"),
  ownerId: text("ownerId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

const groupRelations = relations(groups, ({ one, many }) => ({
  owner: one(users, {
    fields: [groups.ownerId],
    references: [users.id],
  }),
  members: many(groupMembers),
  favoriteUsers: many(userFavoriteGroups),
}));

export const groupInviteTokens = pgTable(
  "groupInviteToken",
  {
    identifier: text("identifier")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (git) => ({
    compoundKey: primaryKey({ columns: [git.identifier, git.token] }),
  })
);

export const groupMembers = pgTable(
  "groupMember",
  {
    groupId: text("groupId")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: groupRole("role").notNull().default("Member"),
  },
  (gm) => ({
    compoundKey: primaryKey({ columns: [gm.groupId, gm.userId] }),
  })
);

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

export const groupAvailableGames = pgTable("groupAvailableGame", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  description: varchar("description", { length: 288 }),
  minPlayers: integer("minPlayers").notNull(),
  maxPlayers: integer("maxPlayers").notNull(),
  image: text("image"),
  addedBy: text("addedBy")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  groupId: text("groupId")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
});

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

export const groupGameRating = pgTable(
  "groupGameRating",
  {
    gameId: text("gameId")
      .notNull()
      .references(() => groupAvailableGames.id, { onDelete: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
  },
  (ggm) => ({
    compoundKey: primaryKey({ columns: [ggm.gameId, ggm.userId] }),
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

export const groupEvents = pgTable("groupEvents", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  groupId: text("groupId")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  game: text("game")
    .notNull()
    .references(() => groupAvailableGames.id, { onDelete: "cascade" }),
  description: varchar("description", { length: 288 }),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  mandatoryPlayer: text("mandatoryPlayer").references(() => users.id, {
    onDelete: "cascade",
  }),
});

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

export const groupEventsConfirmation = pgTable(
  "groupEventsConfirmation",
  {
    eventId: text("eventId")
      .notNull()
      .references(() => groupEvents.id, { onDelete: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    confirmed: integer("confirmation").notNull().default(1),
  },
  (gec) => ({
    compoundKey: primaryKey({ columns: [gec.eventId, gec.userId] }),
  })
);

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

export const memberAvailability = pgTable(
  "memberAvailability",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    dayOfWeek: integer("dayOfWeek").notNull(),
    startTime: text("startTime").notNull(),
    endTime: text("endTime").notNull(),
  },

  (ma) => ({
    unique: {
      columns: [ma.userId, ma.dayOfWeek, ma.startTime, ma.endTime],
    },
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

export const memberAbsence = pgTable(
  "memberAbsence",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    startDate: timestamp("startDate", { mode: "date" }).notNull(),
    endDate: timestamp("endDate", { mode: "date" }).notNull(),
    reason: text("reason"),
  },
  (ma) => ({
    unique: {
      columns: [ma.userId, ma.startDate, ma.endDate],
    },
  })
);

export const memberAbsenceRelation = relations(memberAbsence, ({ one }) => ({
  user: one(users, {
    fields: [memberAbsence.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;

export type UserWithRelations = InferResultType<
  "users",
  { absences: true; availability: true }
>;

export type Availability = typeof memberAvailability.$inferSelect;
export type Absence = typeof memberAbsence.$inferSelect;

export type Group = typeof groups.$inferSelect;
export type InviteToken = typeof groupInviteTokens.$inferSelect;
export type GroupMember = typeof groupMembers.$inferSelect;
export type GroupMemberWithRelations = InferResultType<
  "groupMembers",
  {
    user:
      | true
      | {
          with: {
            absences: true;
            availability: true;
          };
        };
  }
>;

export type Game = typeof groupAvailableGames.$inferSelect;
export type GameRating = typeof groupGameRating.$inferSelect;

export type Event = typeof groupEvents.$inferSelect;

export type EventWithRelations = InferResultType<
  "groupEvents",
  { group: true; game: true; mandatoryPlayer: true; confirmations: true }
>;

export type EventConfirmation = typeof groupEventsConfirmation.$inferSelect;
