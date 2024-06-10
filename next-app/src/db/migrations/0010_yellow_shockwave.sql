ALTER TABLE "groupAvailableGame" DROP CONSTRAINT "groupAvailableGame_addedBy_user_id_fk";
--> statement-breakpoint
ALTER TABLE "groupEvent" DROP CONSTRAINT "groupEvent_groupId_group_id_fk";
--> statement-breakpoint
ALTER TABLE "groupEventsConfirmation" DROP CONSTRAINT "groupEventsConfirmation_eventId_groupEvent_id_fk";
--> statement-breakpoint
ALTER TABLE "groupGameRating" DROP CONSTRAINT "groupGameRating_gameId_groupAvailableGame_id_fk";
--> statement-breakpoint
ALTER TABLE "groupInviteToken" DROP CONSTRAINT "groupInviteToken_identifier_group_id_fk";
--> statement-breakpoint
ALTER TABLE "groupMember" DROP CONSTRAINT "groupMember_groupId_group_id_fk";
--> statement-breakpoint
ALTER TABLE "group" DROP CONSTRAINT "group_ownerId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "memberAbsence" DROP CONSTRAINT "memberAbsence_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "memberAvailability" DROP CONSTRAINT "memberAvailability_userId_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groupAvailableGame" ADD CONSTRAINT "groupAvailableGame_addedBy_user_id_fk" FOREIGN KEY ("addedBy") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groupEvent" ADD CONSTRAINT "groupEvent_groupId_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groupEventsConfirmation" ADD CONSTRAINT "groupEventsConfirmation_eventId_groupEvent_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."groupEvent"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groupGameRating" ADD CONSTRAINT "groupGameRating_gameId_groupAvailableGame_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."groupAvailableGame"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groupInviteToken" ADD CONSTRAINT "groupInviteToken_identifier_group_id_fk" FOREIGN KEY ("identifier") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groupMember" ADD CONSTRAINT "groupMember_groupId_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group" ADD CONSTRAINT "group_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "memberAbsence" ADD CONSTRAINT "memberAbsence_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "memberAvailability" ADD CONSTRAINT "memberAvailability_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
