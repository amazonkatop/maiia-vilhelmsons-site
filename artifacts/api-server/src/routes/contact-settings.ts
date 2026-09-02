import { Router } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { contactSettingsTable, db } from "@workspace/db";
import { requireAuth, requireRole } from "../middlewares/auth";
import { serializeDates } from "../lib/serialize";
import { fillRuFromEn } from "../lib/translate";
import { CONTACT_DEFAULTS_EN } from "../lib/contact-defaults";

const router = Router();

const ContactSettingsUpdateBody = z.object({
  inquiryEmail: z.string().email(),
  studioEmail: z.string().email(),
  phone: z.string().min(1),
  studioAddressEn: z.string().min(1),
  studioSubtitleEn: z.string().min(1),
  footerLocation1: z.string().min(1),
  footerLocation2: z.string().min(1),
  footerTaglineEn: z.string().min(1),
  followInstagramUrl: z.string().min(1),
  followPinterestUrl: z.string().min(1),
  followExtraLabel: z.string().min(1),
  followExtraUrl: z.string().min(1),
  privacyContentEn: z.string().min(1),
  termsContentEn: z.string().min(1),
});

const EN_RU_PAIRS = [
  ["studioAddressEn", "studioAddressRu"],
  ["studioSubtitleEn", "studioSubtitleRu"],
  ["footerTaglineEn", "footerTaglineRu"],
  ["privacyContentEn", "privacyContentRu"],
  ["termsContentEn", "termsContentRu"],
] as const;

async function buildDefaultsWithRu() {
  return fillRuFromEn(
    { ...CONTACT_DEFAULTS_EN } as Record<string, unknown>,
    [...EN_RU_PAIRS],
  );
}

export async function ensureContactSettingsRow() {
  const [existing] = await db
    .select()
    .from(contactSettingsTable)
    .where(eq(contactSettingsTable.id, 1));

  if (existing?.studioEmail) return existing;

  const withRu = await buildDefaultsWithRu();
  const values = {
    inquiryEmail: existing?.inquiryEmail ?? String(withRu.inquiryEmail),
    studioEmail: String(withRu.studioEmail),
    phone: String(withRu.phone),
    studioAddressEn: String(withRu.studioAddressEn),
    studioAddressRu: String(withRu.studioAddressRu),
    studioSubtitleEn: String(withRu.studioSubtitleEn),
    studioSubtitleRu: String(withRu.studioSubtitleRu),
    footerLocation1: String(withRu.footerLocation1),
    footerLocation2: String(withRu.footerLocation2),
    footerTaglineEn: String(withRu.footerTaglineEn),
    footerTaglineRu: String(withRu.footerTaglineRu),
    followInstagramUrl: String(withRu.followInstagramUrl),
    followPinterestUrl: String(withRu.followPinterestUrl),
    followExtraLabel: String(withRu.followExtraLabel),
    followExtraUrl: String(withRu.followExtraUrl),
    privacyContentEn: String(withRu.privacyContentEn),
    privacyContentRu: String(withRu.privacyContentRu),
    termsContentEn: String(withRu.termsContentEn),
    termsContentRu: String(withRu.termsContentRu),
    updatedAt: new Date(),
  };

  if (existing) {
    const [updated] = await db
      .update(contactSettingsTable)
      .set(values)
      .where(eq(contactSettingsTable.id, 1))
      .returning();
    return updated!;
  }

  const [created] = await db
    .insert(contactSettingsTable)
    .values({ id: 1, ...values })
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

// GET /contact-settings — public (footer, contact page, legal pages)
router.get("/contact-settings", async (_req, res): Promise<void> => {
  try {
    const row = await ensureContactSettingsRow();
    res.json(serializeDates(row));
  } catch (err) {
    console.error("[contact-settings] GET failed:", err);
    res.status(500).json({ error: "Failed to load contact settings" });
  }
});

// PATCH /contact-settings — Admin or Editor (English in; Russian auto-translated)
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
      const withRu = await fillRuFromEn(
        { ...body.data } as Record<string, unknown>,
        [...EN_RU_PAIRS],
      );

      const [updated] = await db
        .update(contactSettingsTable)
        .set({
          inquiryEmail: body.data.inquiryEmail,
          studioEmail: body.data.studioEmail,
          phone: body.data.phone,
          studioAddressEn: String(withRu.studioAddressEn),
          studioAddressRu: String(withRu.studioAddressRu),
          studioSubtitleEn: String(withRu.studioSubtitleEn),
          studioSubtitleRu: String(withRu.studioSubtitleRu),
          footerLocation1: body.data.footerLocation1,
          footerLocation2: body.data.footerLocation2,
          footerTaglineEn: String(withRu.footerTaglineEn),
          footerTaglineRu: String(withRu.footerTaglineRu),
          followInstagramUrl: body.data.followInstagramUrl,
          followPinterestUrl: body.data.followPinterestUrl,
          followExtraLabel: body.data.followExtraLabel,
          followExtraUrl: body.data.followExtraUrl,
          privacyContentEn: String(withRu.privacyContentEn),
          privacyContentRu: String(withRu.privacyContentRu),
          termsContentEn: String(withRu.termsContentEn),
          termsContentRu: String(withRu.termsContentRu),
          updatedAt: new Date(),
        })
        .where(eq(contactSettingsTable.id, 1))
        .returning();

      res.json(serializeDates(updated));
    } catch (err) {
      console.error("[contact-settings] PATCH failed:", err);
      res.status(500).json({
        error:
          err instanceof Error
            ? err.message
            : "Failed to save contact settings",
      });
    }
  },
);

export default router;
