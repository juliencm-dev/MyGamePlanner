ALTER TABLE "groupEventsConfirmation" DROP CONSTRAINT "groupEventsConfirmation_userId_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groupEventsConfirmation" ADD CONSTRAINT "groupEventsConfirmation_userId_groupMember_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."groupMember"("userId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
