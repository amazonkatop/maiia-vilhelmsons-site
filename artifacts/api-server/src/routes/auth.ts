import { Router } from "express";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, adminUsersTable } from "@workspace/db";
import { hashPassword, verifyPassword, signSessionToken } from "../lib/auth";
import { requireAuth, requireRole, SESSION_COOKIE_NAME } from "../middlewares/auth";

const router = Router();

const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProduction, // requires HTTPS in production (Railway/Render give this by default)
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matches token expiry
  path: "/",
};

const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /auth/login
router.post("/auth/login", async (req, res): Promise<void> => {
  const body = LoginBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [user] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.email, body.data.email.toLowerCase()));

  // Same generic error whether the email doesn't exist or the password
  // is wrong — don't reveal which one, that leaks which emails are registered.
  const invalid = () => res.status(401).json({ error: "Invalid email or password" });

  if (!user) {
    invalid();
    return;
  }

  const valid = await verifyPassword(body.data.password, user.passwordHash);
  if (!valid) {
    invalid();
    return;
  }

  const token = signSessionToken({
    sub: user.id,
    email: user.email,
    role: user.role as "admin" | "editor",
  });

  res.cookie(SESSION_COOKIE_NAME, token, cookieOptions);
  res.json({ id: user.id, email: user.email, role: user.role });
});

// POST /auth/logout
router.post("/auth/logout", (_req, res): void => {
  res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
  res.status(204).send();
});

// GET /auth/me — used by the admin UI to check current login state
router.get("/auth/me", requireAuth, (req, res): void => {
  res.json({ id: req.user!.sub, email: req.user!.email, role: req.user!.role });
});

const CreateUserBody = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "editor"]),
});

// POST /auth/users — admin-only, for creating the Editor (assistant) account.
// There is no public signup route anywhere — this is intentional.
router.post(
  "/auth/users",
  requireAuth,
  requireRole("admin"),
  async (req, res): Promise<void> => {
    const body = CreateUserBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: body.error.message });
      return;
    }

    const existing = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.email, body.data.email.toLowerCase()));
    if (existing.length > 0) {
      res.status(409).json({ error: "A user with this email already exists" });
      return;
    }

    const passwordHash = await hashPassword(body.data.password);
    const [created] = await db
      .insert(adminUsersTable)
      .values({
        email: body.data.email.toLowerCase(),
        passwordHash,
        role: body.data.role,
      })
      .returning();

    res.status(201).json({ id: created.id, email: created.email, role: created.role });
  },
);

export default router;
