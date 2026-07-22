import { Router } from "express";
import { eq, asc } from "drizzle-orm";
import { db, servicesTable } from "@workspace/db";
import {
  ListServicesResponse,
  GetServiceParams,
  GetServiceResponse,
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

export default router;
