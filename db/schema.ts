import {sqliteTable,text,integer,primaryKey,uniqueIndex} from 'drizzle-orm/sqlite-core';
export const creatives=sqliteTable('creatives',{id:text('id').primaryKey(),userId:text('user_id').notNull(),payload:text('payload').notNull(),revision:integer('revision').notNull(),updatedAt:text('updated_at').notNull(),adId:text('ad_id')},t=>[uniqueIndex('creative_owner_ad').on(t.userId,t.adId)]);
export const media=sqliteTable('media',{key:text('key').primaryKey(),userId:text('user_id').notNull(),name:text('name').notNull(),mime:text('mime').notNull(),size:integer('size').notNull()});
export const performance=sqliteTable('performance',{userId:text('user_id').notNull(),key:text('key').notNull(),payload:text('payload').notNull()},t=>[primaryKey({columns:[t.userId,t.key]})]);
export const annotations=sqliteTable('annotations',{userId:text('user_id').notNull(),adId:text('ad_id').notNull(),personaId:text('persona_id').notNull()},t=>[primaryKey({columns:[t.userId,t.adId]})]);
export const audit=sqliteTable('audit',{id:text('id').primaryKey(),userId:text('user_id').notNull(),entity:text('entity').notNull(),action:text('action').notNull(),at:text('at').notNull(),payload:text('payload').notNull()});
