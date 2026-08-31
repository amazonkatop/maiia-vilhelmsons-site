/**
 * Seeds three flagship Hamptons portfolio projects (idempotent).
 *
 *   pnpm --filter @workspace/api-server exec tsx src/scripts/seed-portfolio-projects.ts
 */
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db, projectsTable } from "@workspace/db";
import { translateEnToRu } from "../lib/translate";

const PROJECTS = [
  {
    slug: "hamptons-home-renovation",
    titleEn: "Hamptons Home Renovation — Southampton Residence",
    descriptionEn: `A complete interior architecture renovation of a classic Southampton residence on the South Fork of Long Island. Maiia Vilhelmsons led the project from concept through permit-ready construction documentation — reconfiguring the floor plan for open coastal living, specifying millwork and stone finishes suited to salt-air conditions, and coordinating MEP upgrades with local Hamptons contractors.

The result is a New York–area luxury home that feels light, enduring, and unmistakably Hamptons: pale oak floors, linen upholstery, and rooms shaped by bay light rather than excess ornament. Ideal for homeowners searching for a Hamptons interior designer who combines design vision with technically fluent renovation management.`,
    location: "Southampton, NY",
    projectType: "residential",
    images: ["/images/project-1.jpg", "/images/hero.jpg"],
    featured: true,
    displayOrder: 1,
  },
  {
    slug: "hamptons-holiday-home-styling",
    titleEn: "Seasonal Holiday Home Styling — Bridgehampton Entertaining",
    descriptionEn: `Bespoke interior styling and spatial decoration for a Bridgehampton home prepared for intimate holiday entertaining on the East End. The brief called for flexible, gallery-like rooms that could transform for themed celebrations — from winter gatherings by the fireplace to summer dinner parties opening onto the terrace — without permanent structural change.

Maiia Vilhelmsons designed layered vignettes: sculptural florals, curated tablescapes, and lighting scenes that highlight architectural proportion while creating warmth for guests. A sought-after Hamptons service for clients who want their residence to feel elevated, personal, and ready for every season on Long Island's Gold Coast.`,
    location: "Bridgehampton, NY",
    projectType: "residential",
    images: ["/images/journal-1.jpg", "/images/journal-2.jpg"],
    featured: true,
    displayOrder: 2,
  },
  {
    slug: "hamptons-bayfront-estate-320sqm",
    titleEn: "Bayfront Estate Interior Architecture — 3,450 sq ft Sag Harbor",
    descriptionEn: `Full interior architecture and fit-out for a 320-square-metre (3,450 sq ft) bayfront estate in Sag Harbor, overlooking the protected waters of the Hamptons. The commission encompassed space planning for a multi-level family home, custom joinery design, finish schedules, and construction drawings aligned with New York building requirements.

Every room was composed around panoramic water views and the rhythm of coastal light — from the double-height living salon to private suites and a chef's kitchen built for year-round Hamptons living. For buyers and builders seeking a New York interior architect who delivers bayfront residences with both poetic restraint and technical rigor, this project defines the studio's integrated approach.`,
    location: "Sag Harbor, NY",
    projectType: "residential",
    images: ["/images/project-2.jpg", "/images/project-3.jpg", "/images/hero.jpg"],
    featured: true,
    displayOrder: 3,
  },
] as const;

async function main() {
  for (const project of PROJECTS) {
    const [existing] = await db
      .select({ slug: projectsTable.slug })
      .from(projectsTable)
      .where(eq(projectsTable.slug, project.slug));

    if (existing) {
      console.log(`skip (exists): ${project.slug}`);
      continue;
    }

    console.log(`translating: ${project.slug}…`);
    const titleRu = await translateEnToRu(project.titleEn);
    const descriptionRu = await translateEnToRu(project.descriptionEn);

    const [created] = await db
      .insert(projectsTable)
      .values({
        slug: project.slug,
        titleEn: project.titleEn,
        titleRu,
        descriptionEn: project.descriptionEn,
        descriptionRu,
        location: project.location,
        projectType: project.projectType,
        images: [...project.images],
        featured: project.featured,
        displayOrder: project.displayOrder,
      })
      .returning();

    console.log(`created: ${created.slug} (id ${created.id})`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
