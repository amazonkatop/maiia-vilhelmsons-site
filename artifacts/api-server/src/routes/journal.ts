import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { db, journalPostsTable } from "@workspace/db";
import { serializeDates } from "../lib/serialize";
import { requireAuth, requireRole } from "../middlewares/auth";
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

// GET /journal
router.get("/journal", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(journalPostsTable)
    .orderBy(desc(journalPostsTable.publishedAt));
  res.json(ListJournalPostsResponse.parse(serializeDates(rows)));
});

// POST /journal — Admin or Editor
router.post("/journal", requireAuth, requireRole("admin", "editor"), async (req, res): Promise<void> => {
  const body = CreateJournalPostBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const { publishedAt, ...rest } = body.data;
  const [created] = await db
    .insert(journalPostsTable)
    .values({
      ...rest,
      ...(publishedAt !== undefined ? { publishedAt: new Date(publishedAt) } : {}),
    })
    .returning();
  res.status(201).json(CreateJournalPostResponse.parse(serializeDates(created)));
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

// PATCH /journal/:slug — Admin or Editor
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
  const { publishedAt, ...rest } = body.data;
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
