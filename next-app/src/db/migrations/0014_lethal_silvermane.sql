ALTER TABLE "groupEvent" ADD COLUMN "mandatoryPlayer" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groupEvent" ADD CONSTRAINT "groupEvent_mandatoryPlayer_user_id_fk" FOREIGN KEY ("mandatoryPlayer") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
