CREATE TABLE IF NOT EXISTS "userFavoriteGroup" (
	"userId" text NOT NULL,
	"groupId" text NOT NULL,
	CONSTRAINT "userFavoriteGroup_userId_groupId_pk" PRIMARY KEY("userId","groupId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userFavoriteGroup" ADD CONSTRAINT "userFavoriteGroup_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userFavoriteGroup" ADD CONSTRAINT "userFavoriteGroup_groupId_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
