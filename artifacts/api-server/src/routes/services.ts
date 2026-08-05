import { Router } from "express";
import { eq, asc } from "drizzle-orm";
import { db, servicesTable } from "@workspace/db";
import { requireAuth, requireRole } from "../middlewares/auth";
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

// GET /services
router.get("/services", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(servicesTable)
    .orderBy(asc(servicesTable.displayOrder));
  res.json(ListServicesResponse.parse(rows));
});

// POST /services — Admin or Editor
router.post("/services", requireAuth, requireRole("admin", "editor"), async (req, res): Promise<void> => {
  const body = CreateServiceBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [created] = await db.insert(servicesTable).values(body.data).returning();
  res.status(201).json(CreateServiceResponse.parse(created));
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

// PATCH /services/:slug — Admin or Editor
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
  const [updated] = await db
    .update(servicesTable)
    .set(body.data)
    .where(eq(servicesTable.slug, params.data.slug))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(UpdateServiceResponse.parse(updated));
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
