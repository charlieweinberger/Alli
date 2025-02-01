CREATE TABLE "TEST" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" varchar(255),
	CONSTRAINT "TEST_email_unique" UNIQUE("email")
);
