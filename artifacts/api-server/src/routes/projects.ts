import { Router } from "express";
import { eq, and, asc } from "drizzle-orm";
import { db, projectsTable } from "@workspace/db";
import { serializeDates } from "../lib/serialize";
import { requireAuth, requireRole } from "../middlewares/auth";
import { translateEnToRu } from "../lib/translate";
import {
  ListProjectsQueryParams,
  ListProjectsResponse,
  CreateProjectBody,
  CreateProjectResponse,
  GetProjectParams,
  GetProjectResponse,
  UpdateProjectParams,
  UpdateProjectBody,
  UpdateProjectResponse,
  DeleteProjectParams,
  ListFeaturedProjectsResponse,
} from "@workspace/api-zod";

const router = Router();

async function withTranslatedProjectRu<T extends {
  titleEn?: string;
  descriptionEn?: string;
  titleRu?: string;
  descriptionRu?: string;
}>(data: T): Promise<T> {
  const next = { ...data };
  if (typeof next.titleEn === "string" && next.titleEn.trim()) {
    next.titleRu = await translateEnToRu(next.titleEn);
  }
  if (typeof next.descriptionEn === "string" && next.descriptionEn.trim()) {
    next.descriptionRu = await translateEnToRu(next.descriptionEn);
  }
  return next;
}

// GET /projects/featured — must come before /projects/:slug
router.get("/projects/featured", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.featured, true))
    .orderBy(asc(projectsTable.displayOrder));
  res.json(ListFeaturedProjectsResponse.parse(serializeDates(rows)));
});

// GET /projects
router.get("/projects", async (req, res): Promise<void> => {
  const query = ListProjectsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const conditions = [];
  if (query.data.location) conditions.push(eq(projectsTable.location, query.data.location));
  if (query.data.projectType) conditions.push(eq(projectsTable.projectType, query.data.projectType));
  const rows = await db
    .select()
    .from(projectsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(projectsTable.displayOrder));
  res.json(ListProjectsResponse.parse(serializeDates(rows)));
});

// POST /projects — Admin or Editor (RU auto-translated from EN)
router.post("/projects", requireAuth, requireRole("admin", "editor"), async (req, res): Promise<void> => {
  const raw = { ...req.body };
  if (!raw.titleRu) raw.titleRu = raw.titleEn ?? "";
  if (!raw.descriptionRu) raw.descriptionRu = raw.descriptionEn ?? "";
  const body = CreateProjectBody.safeParse(raw);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  try {
    const values = await withTranslatedProjectRu(body.data);
    const [created] = await db.insert(projectsTable).values(values).returning();
    res.status(201).json(CreateProjectResponse.parse(serializeDates(created)));
  } catch (err) {
    console.error("[projects] create translate failed:", err);
    res.status(500).json({ error: "Translation failed while saving project" });
  }
});

// GET /projects/:slug
router.get("/projects/:slug", async (req, res): Promise<void> => {
  const params = GetProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.slug, params.data.slug));
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(GetProjectResponse.parse(serializeDates(row)));
});

// PATCH /projects/:slug — Admin or Editor (RU auto-translated from EN)
router.patch("/projects/:slug", requireAuth, requireRole("admin", "editor"), async (req, res): Promise<void> => {
  const params = UpdateProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateProjectBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  try {
    const values = await withTranslatedProjectRu(body.data);
    const [updated] = await db
      .update(projectsTable)
      .set(values)
      .where(eq(projectsTable.slug, params.data.slug))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(UpdateProjectResponse.parse(serializeDates(updated)));
  } catch (err) {
    console.error("[projects] update translate failed:", err);
    res.status(500).json({ error: "Translation failed while saving project" });
  }
});

// DELETE /projects/:slug — Admin or Editor
router.delete("/projects/:slug", requireAuth, requireRole("admin", "editor"), async (req, res): Promise<void> => {
  const params = DeleteProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [deleted] = await db
    .delete(projectsTable)
    .where(eq(projectsTable.slug, params.data.slug))
    .returning();
  if (!deleted) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.status(204).send();
});

export default router;
