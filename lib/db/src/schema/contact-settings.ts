import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

/** Singleton row (id = 1) for contact form routing. */
export const contactSettingsTable = pgTable("contact_settings", {
  id: integer("id").primaryKey().default(1),
  inquiryEmail: text("inquiry_email").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertContactSettingsSchema = createInsertSchema(
  contactSettingsTable,
).omit({
  updatedAt: true,
});
export type InsertContactSettings = z.infer<typeof insertContactSettingsSchema>;
export type ContactSettings = typeof contactSettingsTable.$inferSelect;
