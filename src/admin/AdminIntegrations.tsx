import { FormEvent, useEffect, useState } from "react";
import { authStorage } from "../lib/api";

interface IntegrationState {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  adminEmails: string[];
  telegramBotToken: string;
  telegramChatId: string;
  telegramEnabled: boolean;
  hasSupabase: boolean;
}

interface IntegrationForm {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  adminEmails: string;
  telegramBotToken: string;
  telegramChatId: string;
  telegramEnabled: boolean;
}

async function request<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const token = authStorage.getToken() ?? "";
  const response = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error ?? "Request failed");
  }
  return data as T;
}

export default function AdminIntegrations() {
  const [initial, setInitial] = useState<IntegrationState | null>(null);
  const [form, setForm] = useState<IntegrationForm>({
    supabaseUrl: "",
    supabaseAnonKey: "",
    supabaseServiceRoleKey: "",
    adminEmails: "",
    telegramBotToken: "",
    telegramChatId: "",
    telegramEnabled: false,
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setError("");
    const data = await request<IntegrationState>("/api/admin/integrations");
    setInitial(data);
    setForm({
      supabaseUrl: data.supabaseUrl ?? "",
      supabaseAnonKey: "",
      supabaseServiceRoleKey: "",
      adminEmails: (data.adminEmails ?? []).join(", "),
      telegramBotToken: "",
      telegramChatId: data.telegramChatId ?? "",
      telegramEnabled: Boolean(data.telegramEnabled),
    });
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    setError("");
    try {
      const payload = {
        supabaseUrl: form.supabaseUrl.trim(),
        supabaseAnonKey: form.supabaseAnonKey.trim() || undefined,
        supabaseServiceRoleKey: form.supabaseServiceRoleKey.trim() || undefined,
        adminEmails: form.adminEmails
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        telegramBotToken: form.telegramBotToken.trim() || undefined,
        telegramChatId: form.telegramChatId.trim(),
        telegramEnabled: form.telegramEnabled,
      };
      const data = await request<IntegrationState>("/api/admin/integrations", "PATCH", payload);
      setInitial(data);
      setForm((prev) => ({
        ...prev,
        supabaseAnonKey: "",
        supabaseServiceRoleKey: "",
        telegramBotToken: "",
      }));
      setStatus(
        "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u0438\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0439 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u044b.",
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c",
      );
    } finally {
      setSaving(false);
    }
  }

  async function testSupabase() {
    setStatus("");
    setError("");
    try {
      await request("/api/admin/integrations/test-supabase", "POST");
      setStatus(
        "\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435 Supabase \u0443\u0441\u043f\u0435\u0448\u043d\u043e.",
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "\u041f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 Supabase \u043d\u0435 \u043f\u0440\u043e\u0448\u043b\u0430",
      );
    }
  }

  async function testTelegram() {
    setStatus("");
    setError("");
    try {
      await request("/api/admin/integrations/test-telegram", "POST");
      setStatus(
        "\u0422\u0435\u0441\u0442\u043e\u0432\u043e\u0435 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435 Telegram \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u043e.",
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "\u041f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 Telegram \u043d\u0435 \u043f\u0440\u043e\u0448\u043b\u0430",
      );
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">
          {"\u0418\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438"}
        </h1>
        <p className="text-sm text-stone-500">
          {"\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0430 API-\u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0439 Supabase \u0438 Telegram \u043f\u0440\u044f\u043c\u043e \u0438\u0437 \u0430\u0434\u043c\u0438\u043d\u043a\u0438."}
        </p>
      </div>

      {initial ? (
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-xs text-stone-600">
          <div>
            {"Supabase configured: "}
            {initial.hasSupabase ? "yes" : "no"}
          </div>
          <div>
            {"Anon key: "}
            {initial.supabaseAnonKey || "not set"}
          </div>
          <div>
            {"Service key: "}
            {initial.supabaseServiceRoleKey || "not set"}
          </div>
          <div>
            {"Telegram token: "}
            {initial.telegramBotToken || "not set"}
          </div>
        </div>
      ) : null}

      <form onSubmit={save} className="grid gap-5">
        <section className="rounded-xl border border-stone-200 p-4">
          <h2 className="mb-3 text-lg font-medium">Supabase</h2>
          <div className="grid gap-3">
            <input
              className="rounded-md border border-stone-300 px-3 py-2 text-sm"
              placeholder="Supabase URL"
              value={form.supabaseUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, supabaseUrl: e.target.value }))}
            />
            <input
              className="rounded-md border border-stone-300 px-3 py-2 text-sm"
              placeholder="Supabase anon key (leave empty to keep current)"
              value={form.supabaseAnonKey}
              onChange={(e) => setForm((prev) => ({ ...prev, supabaseAnonKey: e.target.value }))}
            />
            <input
              className="rounded-md border border-stone-300 px-3 py-2 text-sm"
              placeholder="Supabase service role key (leave empty to keep current)"
              value={form.supabaseServiceRoleKey}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, supabaseServiceRoleKey: e.target.value }))
              }
            />
            <input
              className="rounded-md border border-stone-300 px-3 py-2 text-sm"
              placeholder="Admin emails (comma separated)"
              value={form.adminEmails}
              onChange={(e) => setForm((prev) => ({ ...prev, adminEmails: e.target.value }))}
            />
            <button
              type="button"
              onClick={() => void testSupabase()}
              className="w-fit rounded-md border border-stone-300 px-3 py-2 text-sm"
            >
              {"\u041f\u0440\u043e\u0432\u0435\u0440\u0438\u0442\u044c Supabase"}
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-stone-200 p-4">
          <h2 className="mb-3 text-lg font-medium">Telegram Notifications</h2>
          <div className="grid gap-3">
            <input
              className="rounded-md border border-stone-300 px-3 py-2 text-sm"
              placeholder="Telegram bot token (leave empty to keep current)"
              value={form.telegramBotToken}
              onChange={(e) => setForm((prev) => ({ ...prev, telegramBotToken: e.target.value }))}
            />
            <input
              className="rounded-md border border-stone-300 px-3 py-2 text-sm"
              placeholder="Telegram chat id"
              value={form.telegramChatId}
              onChange={(e) => setForm((prev) => ({ ...prev, telegramChatId: e.target.value }))}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.telegramEnabled}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, telegramEnabled: e.target.checked }))
                }
              />
              {"\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0443\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f \u043e \u0437\u0430\u044f\u0432\u043a\u0430\u0445 \u0432 Telegram"}
            </label>
            <button
              type="button"
              onClick={() => void testTelegram()}
              className="w-fit rounded-md border border-stone-300 px-3 py-2 text-sm"
            >
              {"\u0422\u0435\u0441\u0442 Telegram"}
            </button>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-stone-900 px-4 py-2 text-sm text-white"
          >
            {saving
              ? "\u0421\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u0435..."
              : "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0438\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438"}
          </button>
          {status ? <span className="text-sm text-green-700">{status}</span> : null}
          {error ? <span className="text-sm text-red-600">{error}</span> : null}
        </div>
      </form>
    </div>
  );
}
