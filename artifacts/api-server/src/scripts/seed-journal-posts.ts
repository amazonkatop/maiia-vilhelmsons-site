/**
 * Seeds journal posts (idempotent).
 *
 *   pnpm --filter @workspace/api-server run seed-journal
 */
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db, journalPostsTable } from "@workspace/db";
import { translateEnToRu } from "../lib/translate";

const POSTS = [
  {
    slug: "westhampton-charity-designer-showcase-2026",
    titleEn:
      "Westhampton Designer Show House — A Charity Showcase for Cancer Research",
    excerptEn:
      "From August 16–30, leading Hamptons interior designers unveiled bespoke room concepts in a new Westhampton home — an elegant fundraiser supporting cancer treatment and care.",
    coverImage: "/images/journal/westhampton-charity-dining-room.jpg",
    publishedAt: "2026-08-30T18:00:00.000Z",
    bodyEn: `Each summer, the Hamptons become a stage for design at its most generous — and this August, Westhampton hosted one of the season's most meaningful gatherings. From August 16 through 30, a newly completed residence opened its doors for a charity designer showcase, where established Long Island and New York interior designers presented fully realized room concepts throughout the home.

Organized to raise funds for cancer treatment and patient care, the event united design excellence with philanthropy. Guests moved through sun-filled living spaces and a sculptural dining salon, experiencing how thoughtful interior architecture can elevate everyday life while supporting a vital cause.

Maiia Vilhelmsons contributed a refined dining environment conceived for Westhampton entertaining: an oval wood table anchored by a contemporary branch chandelier, velvet dining chairs in coastal blues and sage, and a layered tablescape of hydrangeas, gauzy linens, and artisan ceramics. The composition balanced gallery-like restraint with the warmth expected of a Hamptons summer evening — proof that luxury and purpose can share the same room.

![Designer showcase dining room by Maiia Vilhelmsons in Westhampton](/images/journal/westhampton-charity-dining-room.jpg)

Evening receptions brought together homeowners, collectors, and design peers from across the East End. The atmosphere was celebratory yet intimate — conversations unfolding against floor-to-ceiling glass and views of the Atlantic light that defines Westhampton.

![Guests at the Westhampton charity designer showcase](/images/journal/westhampton-charity-showcase-guests.jpg)

For Maiia Vilhelmsons, participating in the showcase reaffirmed a core studio belief: interior design is not only about beauty, but about community. Events like this demonstrate how New York and Hamptons designers can channel creativity toward outcomes that extend far beyond the finished photograph.

![Maiia Vilhelmsons at the Westhampton charity designer showcase](/images/journal/westhampton-charity-maiia-vilhelmsons.jpg)

If you are planning a Hamptons residence, a Manhattan pied-à-terre, or a fundraising showcase of your own, the studio welcomes enquiries for interior architecture, bespoke furnishing, and event-ready styling across Long Island and New York City.`,
  },
  {
    slug: "hamptons-coastal-dining-room-design",
    titleEn:
      "Hamptons Coastal Dining Room Design — Entertaining with Architectural Restraint",
    excerptEn:
      "How a Westhampton dining salon combines sculptural lighting, natural wood, and layered tablescapes for elevated Hamptons entertaining — insights from Maiia Vilhelmsons' recent showcase installation.",
    coverImage: "/images/journal/westhampton-charity-maiia-vilhelmsons.jpg",
    publishedAt: "2026-08-28T14:00:00.000Z",
    bodyEn: `A Hamptons dining room should feel effortless — yet achieving that ease requires rigorous interior architecture. In a recent Westhampton installation, Maiia Vilhelmsons shaped a coastal dining salon around three principles: proportion, material honesty, and light.

The room begins with an oval solid-wood table — a deliberate counterpoint to rectilinear architecture. Curved bucket chairs in velvet, finished in tide-washed blue and olive, soften the geometry without sacrificing structure. Above, a branch-form chandelier with disc diffusers casts an even, gallery-like glow — a fixture choice that reads contemporary while respecting the home's vertical volume.

![Coastal dining room design in Westhampton by Maiia Vilhelmsons](/images/journal/westhampton-charity-dining-room.jpg)

Tablescaping followed the same disciplined palette: white hydrangeas, aged branches, translucent glassware with a hint of sea-glass blue, and a sheer runner that introduces movement without clutter. For Hamptons hosts who entertain frequently, this approach allows the room to transition from daytime lunches to candlelit charity evenings without re-styling the architecture.

![Maiia Vilhelmsons — Hamptons interior designer](/images/journal/westhampton-charity-maiia-vilhelmsons.jpg)

Designers searching for a New York interior architect with Hamptons experience often ask how to balance prestige with livability. The answer, demonstrated here, is to let materials speak quietly — wood grain, linen texture, and botanical scale — while engineering lighting and seating for real gatherings.

Follow the studio on Instagram @mvlh_interiors for behind-the-scenes process, finished rooms, and upcoming Hamptons and Manhattan projects.`,
  },
] as const;

async function main() {
  for (const post of POSTS) {
    const [existing] = await db
      .select({ slug: journalPostsTable.slug })
      .from(journalPostsTable)
      .where(eq(journalPostsTable.slug, post.slug));

    if (existing) {
      console.log(`skip (exists): ${post.slug}`);
      continue;
    }

    console.log(`translating: ${post.slug}…`);
    const titleRu = await translateEnToRu(post.titleEn);
    const excerptRu = await translateEnToRu(post.excerptEn);
    const bodyRu = await translateEnToRu(post.bodyEn);

    const [created] = await db
      .insert(journalPostsTable)
      .values({
        slug: post.slug,
        titleEn: post.titleEn,
        titleRu,
        excerptEn: post.excerptEn,
        excerptRu,
        bodyEn: post.bodyEn,
        bodyRu,
        coverImage: post.coverImage,
        publishedAt: new Date(post.publishedAt),
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
