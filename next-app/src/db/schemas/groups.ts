import {
  timestamp,
  pgTable,
  text,
  integer,
  primaryKey,
  pgEnum,
  varchar,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { InferResultType, users } from "@/db/schema";

export const groupRole = pgEnum("role", ["Group Owner", "Admin", "Member"]);

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
