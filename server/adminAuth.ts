import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "adminpass22";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const SESSIONS_FILE = path.resolve(process.cwd(), "server", ".sessions.json");

interface SessionsData {
  tokens: Record<string, number>;
}

async function loadSessions(): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  try {
    const content = await fs.readFile(SESSIONS_FILE, "utf8");
    const data = JSON.parse(content) as SessionsData;
    if (data.tokens) {
      for (const [token, expiresAt] of Object.entries(data.tokens)) {
        if (expiresAt > Date.now()) {
          map.set(token, expiresAt);
        }
      }
    }
  } catch {
    // File doesn't exist or is invalid, start fresh
  }
  return map;
}

async function saveSessions(sessions: Map<string, number>): Promise<void> {
  const obj: SessionsData = { tokens: Object.fromEntries(sessions) };
  await fs.writeFile(SESSIONS_FILE, JSON.stringify(obj, null, 2), "utf8");
}

let sessions: Map<string, number> | null = null;

async function getSessions(): Promise<Map<string, number>> {
  if (!sessions) {
    sessions = await loadSessions();
  }
  return sessions;
}

export function authenticateAdmin(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export async function createAdminSession(): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const map = await getSessions();
  map.set(token, expiresAt);
  await saveSessions(map);
  return token;
}

export async function verifyAdminSession(token: string): Promise<boolean> {
  const map = await getSessions();
  const expiresAt = map.get(token);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    map.delete(token);
    await saveSessions(map);
    return false;
  }
  return true;
}
