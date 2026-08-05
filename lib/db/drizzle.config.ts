import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));

// Prefer an explicit DATABASE_URL; otherwise load from the api-server .env
// (local workflow) or a package-local .env.
if (!process.env.DATABASE_URL) {
  config({ path: path.resolve(here, "../../artifacts/api-server/.env") });
  config({ path: path.resolve(here, ".env") });
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is required. Set it in the environment or in artifacts/api-server/.env",
  );
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
