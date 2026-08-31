import { Router } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { contactSettingsTable, db } from "@workspace/db";
import { requireAuth, requireRole } from "../middlewares/auth";
import { serializeDates } from "../lib/serialize";

const router = Router();

const DEFAULT_INQUIRY_EMAIL = "bottegadisegno@gmail.com";

const ContactSettingsUpdateBody = z.object({
  inquiryEmail: z.string().email(),
});

export async function ensureContactSettingsRow() {
  const [existing] = await db
    .select()
    .from(contactSettingsTable)
    .where(eq(contactSettingsTable.id, 1));
  if (existing) return existing;

  const [created] = await db
    .insert(contactSettingsTable)
    .values({
      id: 1,
      inquiryEmail: DEFAULT_INQUIRY_EMAIL,
    })
    .onConflictDoNothing()
    .returning();

  if (created) return created;

  const [again] = await db
    .select()
    .from(contactSettingsTable)
    .where(eq(contactSettingsTable.id, 1));
  return again!;
}

export async function getInquiryEmail(): Promise<string> {
  const row = await ensureContactSettingsRow();
  return row.inquiryEmail;
}

// GET /contact-settings — Admin or Editor
router.get(
  "/contact-settings",
  requireAuth,
  requireRole("admin", "editor"),
  async (_req, res): Promise<void> => {
    try {
      const row = await ensureContactSettingsRow();
      res.json(serializeDates(row));
    } catch (err) {
      console.error("[contact-settings] GET failed:", err);
      res.status(500).json({ error: "Failed to load contact settings" });
    }
  },
);

// PATCH /contact-settings — Admin or Editor
router.patch(
  "/contact-settings",
  requireAuth,
  requireRole("admin", "editor"),
  async (req, res): Promise<void> => {
    const body = ContactSettingsUpdateBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: body.error.message });
      return;
    }

    try {
      await ensureContactSettingsRow();
      const [updated] = await db
        .update(contactSettingsTable)
        .set({
          inquiryEmail: body.data.inquiryEmail,
          updatedAt: new Date(),
        })
        .where(eq(contactSettingsTable.id, 1))
        .returning();

      res.json(serializeDates(updated));
    } catch (err) {
      console.error("[contact-settings] PATCH failed:", err);
      res.status(500).json({ error: "Failed to save contact settings" });
    }
  },
);

export default router;
