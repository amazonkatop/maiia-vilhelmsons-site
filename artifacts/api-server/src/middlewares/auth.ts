import type { Request, Response, NextFunction } from "express";
import { verifySessionToken, type SessionPayload } from "../lib/auth";

export const SESSION_COOKIE_NAME = "maiia_admin_session";

declare global {
  namespace Express {
    interface Request {
      user?: SessionPayload;
    }
  }
}

/** Rejects the request with 401 unless a valid session cookie is present. */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.[SESSION_COOKIE_NAME];
  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const payload = verifySessionToken(token);
  if (!payload) {
    res.status(401).json({ error: "Session expired or invalid" });
    return;
  }
  req.user = payload;
  next();
}

/**
 * Restricts a route to specific roles. Must run after requireAuth
 * (relies on req.user being set).
 */
export function requireRole(...roles: Array<"admin" | "editor">) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }
    next();
  };
}
