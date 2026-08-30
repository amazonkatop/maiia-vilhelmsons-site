import { Router } from "express";
import { eq, asc } from "drizzle-orm";
import { db, servicesTable } from "@workspace/db";
import { requireAuth, requireRole } from "../middlewares/auth";
import { translateEnToRu } from "../lib/translate";
import {
  ListServicesResponse,
  CreateServiceBody,
  CreateServiceResponse,
  GetServiceParams,
  GetServiceResponse,
  UpdateServiceParams,
  UpdateServiceBody,
  UpdateServiceResponse,
  DeleteServiceParams,
} from "@workspace/api-zod";

const router = Router();

async function withTranslatedServiceRu<T extends {
  titleEn?: string;
  shortDescEn?: string;
  fullDescEn?: string;
  titleRu?: string;
  shortDescRu?: string;
  fullDescRu?: string;
}>(data: T): Promise<T> {
  const next = { ...data };
  if (typeof next.titleEn === "string" && next.titleEn.trim()) {
    next.titleRu = await translateEnToRu(next.titleEn);
  }
  if (typeof next.shortDescEn === "string" && next.shortDescEn.trim()) {
    next.shortDescRu = await translateEnToRu(next.shortDescEn);
  }
  if (typeof next.fullDescEn === "string" && next.fullDescEn.trim()) {
    next.fullDescRu = await translateEnToRu(next.fullDescEn);
  }
  return next;
}

// GET /services
router.get("/services", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(servicesTable)
    .orderBy(asc(servicesTable.displayOrder));
  res.json(ListServicesResponse.parse(rows));
});

// POST /services — Admin or Editor (RU auto-translated from EN)
router.post("/services", requireAuth, requireRole("admin", "editor"), async (req, res): Promise<void> => {
  const raw = { ...req.body };
  if (!raw.titleRu) raw.titleRu = raw.titleEn ?? "";
  if (!raw.shortDescRu) raw.shortDescRu = raw.shortDescEn ?? "";
  if (!raw.fullDescRu) raw.fullDescRu = raw.fullDescEn ?? "";
  const body = CreateServiceBody.safeParse(raw);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  try {
    const values = await withTranslatedServiceRu(body.data);
    const [created] = await db.insert(servicesTable).values(values).returning();
    res.status(201).json(CreateServiceResponse.parse(created));
  } catch (err) {
    console.error("[services] create translate failed:", err);
    res.status(500).json({ error: "Translation failed while saving service" });
  }
});

// GET /services/:slug
router.get("/services/:slug", async (req, res): Promise<void> => {
  const params = GetServiceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.slug, params.data.slug));
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(GetServiceResponse.parse(row));
});

// PATCH /services/:slug — Admin or Editor (RU auto-translated from EN)
router.patch("/services/:slug", requireAuth, requireRole("admin", "editor"), async (req, res): Promise<void> => {
  const params = UpdateServiceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateServiceBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  try {
    const values = await withTranslatedServiceRu(body.data);
    const [updated] = await db
      .update(servicesTable)
      .set(values)
      .where(eq(servicesTable.slug, params.data.slug))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(UpdateServiceResponse.parse(updated));
  } catch (err) {
    console.error("[services] update translate failed:", err);
    res.status(500).json({ error: "Translation failed while saving service" });
  }
});

// DELETE /services/:slug — Admin or Editor
router.delete("/services/:slug", requireAuth, requireRole("admin", "editor"), async (req, res): Promise<void> => {
  const params = DeleteServiceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [deleted] = await db
    .delete(servicesTable)
    .where(eq(servicesTable.slug, params.data.slug))
    .returning();
  if (!deleted) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.status(204).send();
});

export default router;
