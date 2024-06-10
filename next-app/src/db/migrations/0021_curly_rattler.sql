ALTER TABLE "groupEvent" RENAME TO "groupEvents";--> statement-breakpoint
ALTER TABLE "groupEvents" DROP CONSTRAINT "groupEvent_groupId_group_id_fk";
--> statement-breakpoint
ALTER TABLE "groupEvents" DROP CONSTRAINT "groupEvent_game_groupAvailableGame_id_fk";
--> statement-breakpoint
ALTER TABLE "groupEvents" DROP CONSTRAINT "groupEvent_mandatoryPlayer_user_id_fk";
--> statement-breakpoint
ALTER TABLE "groupEventsConfirmation" DROP CONSTRAINT "groupEventsConfirmation_eventId_groupEvent_id_fk";
--> statement-breakpoint
ALTER TABLE "memberAbsence" DROP CONSTRAINT "memberAbsence_groupId_group_id_fk";
--> statement-breakpoint
ALTER TABLE "memberAvailability" DROP CONSTRAINT "memberAvailability_groupId_group_id_fk";
--> statement-breakpoint
ALTER TABLE "memberAvailability" ALTER COLUMN "startTime" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "memberAvailability" ALTER COLUMN "endTime" SET DATA TYPE text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groupEvents" ADD CONSTRAINT "groupEvents_groupId_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groupEvents" ADD CONSTRAINT "groupEvents_game_groupAvailableGame_id_fk" FOREIGN KEY ("game") REFERENCES "public"."groupAvailableGame"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groupEvents" ADD CONSTRAINT "groupEvents_mandatoryPlayer_user_id_fk" FOREIGN KEY ("mandatoryPlayer") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groupEventsConfirmation" ADD CONSTRAINT "groupEventsConfirmation_eventId_groupEvents_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."groupEvents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "memberAbsence" DROP COLUMN IF EXISTS "groupId";--> statement-breakpoint
ALTER TABLE "memberAvailability" DROP COLUMN IF EXISTS "groupId";