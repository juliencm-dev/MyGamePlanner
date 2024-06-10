import {
  pgTable,
  text,
  integer,
  primaryKey,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

import { createId } from "@paralleldrive/cuid2";
import {
  groups,
  groupAvailableGames,
  users,
  InferResultType,
} from "@/db/schema";

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

export type Event = typeof groupEvents.$inferSelect;

export type EventWithRelations = InferResultType<
  "groupEvents",
  { group: true; game: true; mandatoryPlayer: true; confirmations: true }
>;

export type EventConfirmation = typeof groupEventsConfirmation.$inferSelect;
