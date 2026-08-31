/**
 * Seeds core services for the homepage "Our Approach" section (idempotent).
 *
 *   pnpm --filter @workspace/api-server run seed-services
 */
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db, servicesTable } from "@workspace/db";
import { translateEnToRu } from "../lib/translate";

const SERVICES = [
  {
    slug: "interior-architecture-hamptons-nyc",
    titleEn: "Interior Architecture — Hamptons & New York",
    shortDescEn:
      "Full-service interior architecture for luxury residences in Manhattan, Brooklyn, and the Hamptons — space planning, millwork, lighting design, and finish specification from concept to installation.",
    fullDescEn: `Maiia Vilhelmsons provides interior architecture for discerning homeowners across New York City and Long Island's East End. Whether you are renovating a pre-war Manhattan apartment, building a new Southampton residence, or reimagining a Bridgehampton summer home, the studio delivers a unified design language rooted in proportion, natural light, and material integrity.

Every commission begins with listening — understanding how you live, entertain, and move through your home. From there, Maiia develops spatial plans, custom joinery concepts, lighting layouts, and curated finish palettes that feel timeless rather than trend-driven. The result is a New York or Hamptons interior that reads as inevitable: refined, livable, and unmistakably yours.

Clients searching for a Hamptons interior designer or a New York interior architect who combines aesthetic vision with technical fluency find in this service a single point of accountability from first sketch to final styling.`,
    displayOrder: 1,
  },
  {
    slug: "hamptons-home-renovation-design",
    titleEn: "Hamptons Home Renovation & Design Management",
    shortDescEn:
      "End-to-end renovation leadership for East End homes — coordinating architects, contractors, and engineers across Southampton, Westhampton, Sag Harbor, and the wider Hamptons.",
    fullDescEn: `Renovating in the Hamptons demands more than beautiful selections — it requires a designer who speaks the language of local contractors, seasonal construction schedules, and coastal building conditions. Maiia Vilhelmsons manages high-end residential renovations from feasibility through final walkthrough, ensuring design intent survives every site meeting.

The studio coordinates floor-plan reconfiguration, structural openings, kitchen and bath redesign, and MEP upgrades while specifying finishes suited to salt air and year-round occupancy. Regular site visits, contractor communication, and decision logging keep projects on schedule and within agreed scope.

For homeowners undertaking a Hamptons home renovation who want a New York–trained interior architect on site — not only at the presentation board — this service delivers clarity, craftsmanship, and calm throughout the build.`,
    displayOrder: 2,
  },
  {
    slug: "construction-documentation-permit-ready",
    titleEn: "Construction Documentation & Permit-Ready Drawings",
    shortDescEn:
      "Technical interior architecture packages for New York renovations and new construction — millwork details, reflected ceiling plans, finish schedules, and documentation aligned with local building requirements.",
    fullDescEn: `Design ideas only become architecture when they can be built accurately. Maiia Vilhelmsons prepares permit-ready construction documentation that bridges creative vision and contractor execution — a distinctive strength among New York and Hamptons interior designers.

Deliverables include space plans, interior elevations, millwork and cabinetry details, lighting and power layouts, finish schedules, and fixture specifications. Documentation is structured for submission to building departments, coordination with structural engineers, and use by millworkers and trades on site.

Developers, architects, and homeowners who need an interior architect in New York capable of producing rigorous technical drawings — not just mood boards — rely on this service to reduce change orders, prevent miscommunication, and protect design quality through construction.`,
    displayOrder: 3,
  },
  {
    slug: "bespoke-styling-hamptons-entertaining",
    titleEn: "Bespoke Styling & Hamptons Entertaining Design",
    shortDescEn:
      "Curated furnishing, art placement, and event-ready tablescapes for Hamptons residences and Manhattan homes — including designer showcase installations and seasonal refreshes.",
    fullDescEn: `Beyond permanent architecture, Maiia Vilhelmsons shapes how a home feels in motion — furnished for daily life, styled for summer evenings, and prepared for the gatherings that define Hamptons culture. This service covers furniture selection, art and object placement, window treatments, and layered tablescapes that elevate entertaining without overwhelming the architecture.

Recent work includes dining salon installations for charity designer showcases in Westhampton, where sculptural florals, refined ceramics, and calibrated lighting transformed a new-build residence into an immersive design experience. Seasonal refreshes allow established clients to adapt primary and secondary homes for holidays, weekend guests, and open-house events.

Ideal for clients who want their Hamptons or Manhattan residence to feel complete, personal, and ready to welcome — with the same editorial restraint that defines the studio's architectural work.`,
    displayOrder: 4,
  },
] as const;

async function main() {
  for (const service of SERVICES) {
    const [existing] = await db
      .select({ slug: servicesTable.slug })
      .from(servicesTable)
      .where(eq(servicesTable.slug, service.slug));

    if (existing) {
      console.log(`skip (exists): ${service.slug}`);
      continue;
    }

    console.log(`translating: ${service.slug}…`);
    const titleRu = await translateEnToRu(service.titleEn);
    const shortDescRu = await translateEnToRu(service.shortDescEn);
    const fullDescRu = await translateEnToRu(service.fullDescEn);

    const [created] = await db
      .insert(servicesTable)
      .values({
        slug: service.slug,
        titleEn: service.titleEn,
        titleRu,
        shortDescEn: service.shortDescEn,
        shortDescRu,
        fullDescEn: service.fullDescEn,
        fullDescRu,
        displayOrder: service.displayOrder,
      })
      .returning();

    console.log(`created: ${created.slug} (id ${created.id})`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
