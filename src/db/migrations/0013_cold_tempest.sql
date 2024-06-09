ALTER TABLE "groupEvent" ADD COLUMN "game" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groupEvent" ADD CONSTRAINT "groupEvent_game_groupAvailableGame_id_fk" FOREIGN KEY ("game") REFERENCES "public"."groupAvailableGame"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
