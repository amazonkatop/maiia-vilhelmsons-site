import { Router } from "express";
import { eq, and, asc } from "drizzle-orm";
import { db, projectsTable } from "@workspace/db";
import { serializeDates } from "../lib/serialize";
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

// POST /projects
router.post("/projects", async (req, res): Promise<void> => {
  const body = CreateProjectBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [created] = await db.insert(projectsTable).values(body.data).returning();
  res.status(201).json(CreateProjectResponse.parse(serializeDates(created)));
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

// PATCH /projects/:slug
router.patch("/projects/:slug", async (req, res): Promise<void> => {
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
  const [updated] = await db
    .update(projectsTable)
    .set(body.data)
    .where(eq(projectsTable.slug, params.data.slug))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(UpdateProjectResponse.parse(serializeDates(updated)));
});

// DELETE /projects/:slug
router.delete("/projects/:slug", async (req, res): Promise<void> => {
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
