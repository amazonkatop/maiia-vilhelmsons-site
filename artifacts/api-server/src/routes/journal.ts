import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { db, journalPostsTable } from "@workspace/db";
import { serializeDates } from "../lib/serialize";
import {
  ListJournalPostsResponse,
  GetJournalPostParams,
  GetJournalPostResponse,
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

export default router;
