import { Router } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, homepageTable } from "@workspace/db";
import { requireAuth, requireRole } from "../middlewares/auth";
import { fillRuFromEn } from "../lib/translate";
import { HOMEPAGE_DEFAULTS_EN } from "../lib/homepage-defaults";
import { serializeDates } from "../lib/serialize";

const router = Router();

const HomepageUpdateBody = z.object({
  heroImage: z.string().min(1),
  heroEyebrowEn: z.string().min(1),
  heroHeadlineEn: z.string().min(1),
  designerPortrait: z.string().min(1),
  designerEyebrowEn: z.string().min(1),
  designerName: z.string().min(1),
  designerBio1En: z.string().min(1),
  designerBio2En: z.string().min(1),
  designerBio3En: z.string().min(1),
  studioImage: z.string().min(1),
  studioEyebrowEn: z.string().min(1),
  studioHeadlineEn: z.string().min(1),
  studioBodyEn: z.string().min(1),
});

const EN_RU_PAIRS = [
  ["heroEyebrowEn", "heroEyebrowRu"],
  ["heroHeadlineEn", "heroHeadlineRu"],
  ["designerEyebrowEn", "designerEyebrowRu"],
  ["designerBio1En", "designerBio1Ru"],
  ["designerBio2En", "designerBio2Ru"],
  ["designerBio3En", "designerBio3Ru"],
  ["studioEyebrowEn", "studioEyebrowRu"],
  ["studioHeadlineEn", "studioHeadlineRu"],
  ["studioBodyEn", "studioBodyRu"],
] as const;

async function ensureHomepageRow() {
  const [existing] = await db
    .select()
    .from(homepageTable)
    .where(eq(homepageTable.id, 1));
  if (existing) return existing;

  const withRu = await fillRuFromEn(
    { ...HOMEPAGE_DEFAULTS_EN } as Record<string, unknown>,
    [...EN_RU_PAIRS],
  );

  const [created] = await db
    .insert(homepageTable)
    .values({
      id: 1,
      heroImage: String(withRu.heroImage),
      heroEyebrowEn: String(withRu.heroEyebrowEn),
      heroEyebrowRu: String(withRu.heroEyebrowRu),
      heroHeadlineEn: String(withRu.heroHeadlineEn),
      heroHeadlineRu: String(withRu.heroHeadlineRu),
      designerPortrait: String(withRu.designerPortrait),
      designerEyebrowEn: String(withRu.designerEyebrowEn),
      designerEyebrowRu: String(withRu.designerEyebrowRu),
      designerName: String(withRu.designerName),
      designerBio1En: String(withRu.designerBio1En),
      designerBio1Ru: String(withRu.designerBio1Ru),
      designerBio2En: String(withRu.designerBio2En),
      designerBio2Ru: String(withRu.designerBio2Ru),
      designerBio3En: String(withRu.designerBio3En),
      designerBio3Ru: String(withRu.designerBio3Ru),
      studioImage: String(withRu.studioImage),
      studioEyebrowEn: String(withRu.studioEyebrowEn),
      studioEyebrowRu: String(withRu.studioEyebrowRu),
      studioHeadlineEn: String(withRu.studioHeadlineEn),
      studioHeadlineRu: String(withRu.studioHeadlineRu),
      studioBodyEn: String(withRu.studioBodyEn),
      studioBodyRu: String(withRu.studioBodyRu),
    })
    .onConflictDoNothing()
    .returning();

  if (created) return created;

  const [again] = await db
    .select()
    .from(homepageTable)
    .where(eq(homepageTable.id, 1));
  return again!;
}

// GET /homepage — public
router.get("/homepage", async (_req, res): Promise<void> => {
  try {
    const row = await ensureHomepageRow();
    res.json(serializeDates(row));
  } catch (err) {
    console.error("[homepage] GET failed:", err);
    res.status(500).json({ error: "Failed to load homepage content" });
  }
});

// PATCH /homepage — Admin or Editor (English in; Russian auto-translated)
router.patch(
  "/homepage",
  requireAuth,
  requireRole("admin", "editor"),
  async (req, res): Promise<void> => {
    const body = HomepageUpdateBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: body.error.message });
      return;
    }

    try {
      await ensureHomepageRow();
      const withRu = await fillRuFromEn(
        { ...body.data } as Record<string, unknown>,
        [...EN_RU_PAIRS],
      );

      const [updated] = await db
        .update(homepageTable)
        .set({
          heroImage: String(withRu.heroImage),
          heroEyebrowEn: String(withRu.heroEyebrowEn),
          heroEyebrowRu: String(withRu.heroEyebrowRu),
          heroHeadlineEn: String(withRu.heroHeadlineEn),
          heroHeadlineRu: String(withRu.heroHeadlineRu),
          designerPortrait: String(withRu.designerPortrait),
          designerEyebrowEn: String(withRu.designerEyebrowEn),
          designerEyebrowRu: String(withRu.designerEyebrowRu),
          designerName: String(withRu.designerName),
          designerBio1En: String(withRu.designerBio1En),
          designerBio1Ru: String(withRu.designerBio1Ru),
          designerBio2En: String(withRu.designerBio2En),
          designerBio2Ru: String(withRu.designerBio2Ru),
          designerBio3En: String(withRu.designerBio3En),
          designerBio3Ru: String(withRu.designerBio3Ru),
          studioImage: String(withRu.studioImage),
          studioEyebrowEn: String(withRu.studioEyebrowEn),
          studioEyebrowRu: String(withRu.studioEyebrowRu),
          studioHeadlineEn: String(withRu.studioHeadlineEn),
          studioHeadlineRu: String(withRu.studioHeadlineRu),
          studioBodyEn: String(withRu.studioBodyEn),
          studioBodyRu: String(withRu.studioBodyRu),
          updatedAt: new Date(),
        })
        .where(eq(homepageTable.id, 1))
        .returning();

      res.json(serializeDates(updated));
    } catch (err) {
      console.error("[homepage] PATCH failed:", err);
      res.status(500).json({
        error:
          err instanceof Error
            ? err.message
            : "Failed to save homepage content",
      });
    }
  },
);

export default router;
