import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

/** Singleton row (id = 1) for site contact, footer, and legal pages. */
export const contactSettingsTable = pgTable("contact_settings", {
  id: integer("id").primaryKey().default(1),
  inquiryEmail: text("inquiry_email").notNull(),
  studioEmail: text("studio_email").notNull(),
  phone: text("phone").notNull(),
  studioAddressEn: text("studio_address_en").notNull(),
  studioAddressRu: text("studio_address_ru").notNull(),
  studioSubtitleEn: text("studio_subtitle_en").notNull(),
  studioSubtitleRu: text("studio_subtitle_ru").notNull(),
  footerLocation1: text("footer_location_1").notNull(),
  footerLocation2: text("footer_location_2").notNull(),
  footerTaglineEn: text("footer_tagline_en").notNull(),
  footerTaglineRu: text("footer_tagline_ru").notNull(),
  followInstagramUrl: text("follow_instagram_url").notNull(),
  followPinterestUrl: text("follow_pinterest_url").notNull(),
  followExtraLabel: text("follow_extra_label").notNull(),
  followExtraUrl: text("follow_extra_url").notNull(),
  privacyContentEn: text("privacy_content_en").notNull(),
  privacyContentRu: text("privacy_content_ru").notNull(),
  termsContentEn: text("terms_content_en").notNull(),
  termsContentRu: text("terms_content_ru").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertContactSettingsSchema = createInsertSchema(
  contactSettingsTable,
).omit({
  updatedAt: true,
});
export type InsertContactSettings = z.infer<typeof insertContactSettingsSchema>;
export type ContactSettings = typeof contactSettingsTable.$inferSelect;
