/**
 * Creates the first Admin account. Run once, locally, after the
 * database is set up:
 *
 *   pnpm --filter @workspace/api-server run create-admin -- you@example.com "a strong password"
 *
 * After this, log in at /auth/login and use POST /auth/users (as Admin)
 * to create the Editor account for your assistant — no need to run
 * this script again.
 */
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db, adminUsersTable } from "@workspace/db";
import { hashPassword } from "../lib/auth";

async function main() {
  const [email, password] = process.argv.slice(2);

  if (!email || !password) {
    console.error('Usage: pnpm run create-admin -- <email> "<password>"');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const existing = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.email, email.toLowerCase()));

  if (existing.length > 0) {
    console.error(`A user with email "${email}" already exists.`);
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  const [created] = await db
    .insert(adminUsersTable)
    .values({ email: email.toLowerCase(), passwordHash, role: "admin" })
    .returning();

  console.log(`Admin account created: ${created.email} (id ${created.id})`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
