import { promises as fs } from "node:fs";
import path from "node:path";
import { DEFAULT_SITE_SETTINGS } from "./defaultContent.ts";

export interface RuntimeConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  adminEmails: string[];
  telegramBotToken: string;
  telegramChatId: string;
  telegramEnabled: boolean;
  siteSettings: Record<string, string>;
}

const CONFIG_PATH = path.resolve(process.cwd(), "server", ".runtime-config.json");

const defaultConfig: RuntimeConfig = {
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  adminEmails: (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean),
  telegramBotToken: "",
  telegramChatId: "",
  telegramEnabled: false,
  siteSettings: { ...DEFAULT_SITE_SETTINGS },
};

let cache: RuntimeConfig | null = null;

async function ensureLoaded() {
  if (cache) return cache;
  try {
    const content = await fs.readFile(CONFIG_PATH, "utf8");
    const parsed = JSON.parse(content) as Partial<RuntimeConfig>;
    cache = {
      ...defaultConfig,
      ...parsed,
      siteSettings: {
        ...defaultConfig.siteSettings,
        ...(parsed.siteSettings ?? {}),
      },
      adminEmails: Array.isArray(parsed.adminEmails)
        ? parsed.adminEmails.map((item) => item.toLowerCase())
        : defaultConfig.adminEmails,
    };
  } catch {
    cache = { ...defaultConfig };
  }
  return cache;
}

export async function getRuntimeConfig(): Promise<RuntimeConfig> {
  return ensureLoaded();
}

export async function updateRuntimeConfig(
  patch: Partial<RuntimeConfig>,
): Promise<RuntimeConfig> {
  const current = await ensureLoaded();
  const next: RuntimeConfig = {
    ...current,
    supabaseUrl: patch.supabaseUrl ?? current.supabaseUrl,
    supabaseAnonKey: patch.supabaseAnonKey ?? current.supabaseAnonKey,
    supabaseServiceRoleKey:
      patch.supabaseServiceRoleKey ?? current.supabaseServiceRoleKey,
    telegramBotToken: patch.telegramBotToken ?? current.telegramBotToken,
    telegramChatId: patch.telegramChatId ?? current.telegramChatId,
    telegramEnabled: patch.telegramEnabled ?? current.telegramEnabled,
    siteSettings: patch.siteSettings
      ? { ...current.siteSettings, ...patch.siteSettings }
      : current.siteSettings,
    adminEmails:
      patch.adminEmails?.map((item) => item.toLowerCase()) ?? current.adminEmails,
  };
  cache = next;
  await fs.writeFile(CONFIG_PATH, JSON.stringify(next, null, 2), "utf8");
  return next;
}

export function maskSecret(value: string) {
  if (!value) return "";
  if (value.length < 8) return "******";
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

export function sanitizeConfig(config: RuntimeConfig) {
  return {
    supabaseUrl: config.supabaseUrl,
    supabaseAnonKey: maskSecret(config.supabaseAnonKey),
    supabaseServiceRoleKey: maskSecret(config.supabaseServiceRoleKey),
    adminEmails: config.adminEmails,
    telegramBotToken: maskSecret(config.telegramBotToken),
    telegramChatId: config.telegramChatId,
    telegramEnabled: config.telegramEnabled,
    hasSupabase: Boolean(
      config.supabaseUrl && config.supabaseAnonKey && config.supabaseServiceRoleKey,
    ),
  };
}
