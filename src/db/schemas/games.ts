import {
  pgTable,
  text,
  integer,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { users, groups } from "@/db/schema";

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

export type Game = typeof groupAvailableGames.$inferSelect;
export type GameRating = typeof groupGameRating.$inferSelect;
