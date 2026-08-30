import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { db, journalPostsTable } from "@workspace/db";
import { serializeDates } from "../lib/serialize";
import { requireAuth, requireRole } from "../middlewares/auth";
import { translateEnToRu } from "../lib/translate";
import {
  ListJournalPostsResponse,
  CreateJournalPostBody,
  CreateJournalPostResponse,
  GetJournalPostParams,
  GetJournalPostResponse,
  UpdateJournalPostParams,
  UpdateJournalPostBody,
  UpdateJournalPostResponse,
  DeleteJournalPostParams,
} from "@workspace/api-zod";

const router = Router();

async function withTranslatedJournalRu<T extends {
  titleEn?: string;
  excerptEn?: string;
  bodyEn?: string;
  titleRu?: string;
  excerptRu?: string;
  bodyRu?: string;
}>(data: T): Promise<T> {
  const next = { ...data };
  if (typeof next.titleEn === "string" && next.titleEn.trim()) {
    next.titleRu = await translateEnToRu(next.titleEn);
  }
  if (typeof next.excerptEn === "string" && next.excerptEn.trim()) {
    next.excerptRu = await translateEnToRu(next.excerptEn);
  }
  if (typeof next.bodyEn === "string" && next.bodyEn.trim()) {
    next.bodyRu = await translateEnToRu(next.bodyEn);
  }
  return next;
}

// GET /journal
router.get("/journal", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(journalPostsTable)
    .orderBy(desc(journalPostsTable.publishedAt));
  res.json(ListJournalPostsResponse.parse(serializeDates(rows)));
});

// POST /journal — Admin or Editor (RU auto-translated from EN)
router.post("/journal", requireAuth, requireRole("admin", "editor"), async (req, res): Promise<void> => {
  const raw = { ...req.body };
  if (!raw.titleRu) raw.titleRu = raw.titleEn ?? "";
  if (!raw.excerptRu) raw.excerptRu = raw.excerptEn ?? "";
  if (!raw.bodyRu) raw.bodyRu = raw.bodyEn ?? "";
  const body = CreateJournalPostBody.safeParse(raw);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  try {
    const translated = await withTranslatedJournalRu(body.data);
    const { publishedAt, ...rest } = translated;
    const [created] = await db
      .insert(journalPostsTable)
      .values({
        ...rest,
        ...(publishedAt !== undefined ? { publishedAt: new Date(publishedAt) } : {}),
      })
      .returning();
    res.status(201).json(CreateJournalPostResponse.parse(serializeDates(created)));
  } catch (err) {
    console.error("[journal] create translate failed:", err);
    res.status(500).json({ error: "Translation failed while saving journal post" });
  }
});

// GET /journal/:slug
router.get("/journal/:slug", async (req, res): Promise<void> => {
  const params = GetJournalPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .select()
    .from(journalPostsTable)
    .where(eq(journalPostsTable.slug, params.data.slug));
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(GetJournalPostResponse.parse(serializeDates(row)));
});

// PATCH /journal/:slug — Admin or Editor (RU auto-translated from EN)
router.patch("/journal/:slug", requireAuth, requireRole("admin", "editor"), async (req, res): Promise<void> => {
  const params = UpdateJournalPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateJournalPostBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  try {
    const translated = await withTranslatedJournalRu(body.data);
    const { publishedAt, ...rest } = translated;
    const [updated] = await db
      .update(journalPostsTable)
      .set({
        ...rest,
        ...(publishedAt !== undefined ? { publishedAt: new Date(publishedAt) } : {}),
      })
      .where(eq(journalPostsTable.slug, params.data.slug))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(UpdateJournalPostResponse.parse(serializeDates(updated)));
  } catch (err) {
    console.error("[journal] update translate failed:", err);
    res.status(500).json({ error: "Translation failed while saving journal post" });
  }
});

// DELETE /journal/:slug — Admin or Editor
router.delete("/journal/:slug", requireAuth, requireRole("admin", "editor"), async (req, res): Promise<void> => {
  const params = DeleteJournalPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [deleted] = await db
    .delete(journalPostsTable)
    .where(eq(journalPostsTable.slug, params.data.slug))
    .returning();
  if (!deleted) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.status(204).send();
});

export default router;
