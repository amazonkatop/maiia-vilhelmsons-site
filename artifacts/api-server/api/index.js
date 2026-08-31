let app;

export default async function handler(req, res) {
  try {
    if (!app) {
      const mod = await import("../dist/app.mjs");
      app = mod.default;
    }
    return app(req, res);
  } catch (error) {
    console.error("API bootstrap failed:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "API bootstrap failed",
        message: error instanceof Error ? error.message : String(error),
        hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
        nodeEnv: process.env.NODE_ENV ?? null,
      }),
    );
  }
}
