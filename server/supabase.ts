import { getRuntimeConfig } from "./runtimeConfig.ts";

interface QueryOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string>;
}

function buildUrlWithBase(base: string, path: string, query?: Record<string, string>): string {
  const url = new URL(`${base}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

export async function supabaseRest(path: string, options: QueryOptions = {}) {
  const config = await getRuntimeConfig();
  if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
    throw new Error("Supabase is not configured");
  }
  const url = buildUrlWithBase(config.supabaseUrl, path, options.query);
  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      apikey: config.supabaseServiceRoleKey,
      Authorization: `Bearer ${config.supabaseServiceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error(data?.message ?? `Supabase error: ${res.status}`);
  }
  return data;
}

export async function verifyUser(accessToken: string) {
  const config = await getRuntimeConfig();
  if (!config.supabaseUrl || !config.supabaseAnonKey) return null;
  const res = await fetch(`${config.supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: config.supabaseAnonKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return null;
  return data as { email?: string; app_metadata?: { role?: string } };
}

export async function passwordLogin(email: string, password: string) {
  const config = await getRuntimeConfig();
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw new Error("Supabase is not configured");
  }
  const res = await fetch(`${config.supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: config.supabaseAnonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error_description ?? "Invalid credentials");
  }
  return data as { access_token: string; refresh_token: string; expires_in: number };
}
