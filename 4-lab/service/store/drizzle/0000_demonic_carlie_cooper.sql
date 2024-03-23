CREATE TABLE IF NOT EXISTS "processed_agent_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"road_state" text NOT NULL,
	"x" integer NOT NULL,
	"y" integer NOT NULL,
	"z" integer NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
