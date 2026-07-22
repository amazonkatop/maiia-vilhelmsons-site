import { Router } from "express";
import { db, projectsTable, servicesTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { GetSiteSummaryResponse } from "@workspace/api-zod";

const router = Router();

// GET /site/summary
router.get("/site/summary", async (req, res): Promise<void> => {
  const [{ count: totalProjects }] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(projectsTable);

  const [{ count: totalServices }] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(servicesTable);

  const locationRows = await db
    .selectDistinct({ location: projectsTable.location })
    .from(projectsTable);

  const locations = locationRows.map((r) => r.location);

  res.json(
    GetSiteSummaryResponse.parse({
      totalProjects,
      totalServices,
      locations,
      yearsOfExperience: 12,
    }),
  );
});

export default router;
