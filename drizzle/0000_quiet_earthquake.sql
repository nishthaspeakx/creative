CREATE TABLE `annotations` (
	`user_id` text NOT NULL,
	`ad_id` text NOT NULL,
	`persona_id` text NOT NULL,
	PRIMARY KEY(`user_id`, `ad_id`)
);
--> statement-breakpoint
CREATE TABLE `audit` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`entity` text NOT NULL,
	`action` text NOT NULL,
	`at` text NOT NULL,
	`payload` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `creatives` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`payload` text NOT NULL,
	`revision` integer NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `media` (
	`key` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `performance` (
	`user_id` text NOT NULL,
	`key` text NOT NULL,
	`payload` text NOT NULL,
	PRIMARY KEY(`user_id`, `key`)
);
