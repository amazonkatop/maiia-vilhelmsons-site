import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const journalPostsTable = pgTable("journal_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  titleEn: text("title_en").notNull(),
  titleRu: text("title_ru").notNull(),
  excerptEn: text("excerpt_en").notNull(),
  excerptRu: text("excerpt_ru").notNull(),
  bodyEn: text("body_en").notNull(),
  bodyRu: text("body_ru").notNull(),
  coverImage: text("cover_image").notNull().default(""),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertJournalPostSchema = createInsertSchema(journalPostsTable).omit({ id: true, createdAt: true });
export type InsertJournalPost = z.infer<typeof insertJournalPostSchema>;
export type JournalPost = typeof journalPostsTable.$inferSelect;
