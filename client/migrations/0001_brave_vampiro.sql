CREATE TABLE "connections" (
	"connectId" serial PRIMARY KEY NOT NULL,
	"poster" integer NOT NULL,
	"responder" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"connection_id" integer NOT NULL,
	"sender_id" integer NOT NULL,
	"receiver_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"is_read" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "Post" (
	"userId" integer NOT NULL,
	"postId" integer PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "User" (
	"userId" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"name" text NOT NULL,
	"pronouns" text NOT NULL,
	"genderIdentity" text,
	"sexuality" text,
	"bio" text,
	"hobbies" text,
	"major" text,
	"age" integer
);
--> statement-breakpoint
DROP TABLE "TEST" CASCADE;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_poster_User_userId_fk" FOREIGN KEY ("poster") REFERENCES "public"."User"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_responder_User_userId_fk" FOREIGN KEY ("responder") REFERENCES "public"."User"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_connection_id_connections_connectId_fk" FOREIGN KEY ("connection_id") REFERENCES "public"."connections"("connectId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_User_userId_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."User"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_User_userId_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."User"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_User_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE no action ON UPDATE no action;