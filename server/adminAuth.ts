import crypto from "node:crypto";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "adminpass22";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

const sessions = new Map<string, number>();

export function authenticateAdmin(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function createAdminSession(): string {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_TTL_MS;
  sessions.set(token, expiresAt);
  return token;
}

export function verifyAdminSession(token: string): boolean {
  const expiresAt = sessions.get(token);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    sessions.delete(token);
    return false;
  }
  return true;
}
