import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const servicesTable = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  titleEn: text("title_en").notNull(),
  titleRu: text("title_ru").notNull(),
  shortDescEn: text("short_desc_en").notNull(),
  shortDescRu: text("short_desc_ru").notNull(),
  fullDescEn: text("full_desc_en").notNull(),
  fullDescRu: text("full_desc_ru").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
});

export const insertServiceSchema = createInsertSchema(servicesTable).omit({ id: true });
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof servicesTable.$inferSelect;
