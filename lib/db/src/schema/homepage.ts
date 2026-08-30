import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

/** Singleton row (id = 1) for editable homepage sections. */
export const homepageTable = pgTable("homepage_content", {
  id: integer("id").primaryKey().default(1),
  heroImage: text("hero_image").notNull(),
  heroEyebrowEn: text("hero_eyebrow_en").notNull(),
  heroEyebrowRu: text("hero_eyebrow_ru").notNull(),
  heroHeadlineEn: text("hero_headline_en").notNull(),
  heroHeadlineRu: text("hero_headline_ru").notNull(),
  designerPortrait: text("designer_portrait").notNull(),
  designerEyebrowEn: text("designer_eyebrow_en").notNull(),
  designerEyebrowRu: text("designer_eyebrow_ru").notNull(),
  designerName: text("designer_name").notNull(),
  designerBio1En: text("designer_bio1_en").notNull(),
  designerBio1Ru: text("designer_bio1_ru").notNull(),
  designerBio2En: text("designer_bio2_en").notNull(),
  designerBio2Ru: text("designer_bio2_ru").notNull(),
  designerBio3En: text("designer_bio3_en").notNull(),
  designerBio3Ru: text("designer_bio3_ru").notNull(),
  studioImage: text("studio_image").notNull(),
  studioEyebrowEn: text("studio_eyebrow_en").notNull(),
  studioEyebrowRu: text("studio_eyebrow_ru").notNull(),
  studioHeadlineEn: text("studio_headline_en").notNull(),
  studioHeadlineRu: text("studio_headline_ru").notNull(),
  studioBodyEn: text("studio_body_en").notNull(),
  studioBodyRu: text("studio_body_ru").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertHomepageSchema = createInsertSchema(homepageTable).omit({
  updatedAt: true,
});
export type InsertHomepage = z.infer<typeof insertHomepageSchema>;
export type Homepage = typeof homepageTable.$inferSelect;
