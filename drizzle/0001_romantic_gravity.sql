ALTER TABLE `creatives` ADD `ad_id` text;--> statement-breakpoint
CREATE UNIQUE INDEX `creative_owner_ad` ON `creatives` (`user_id`,`ad_id`);