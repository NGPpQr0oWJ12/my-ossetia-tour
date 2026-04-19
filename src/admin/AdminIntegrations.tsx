import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  BellRing,
  KeyRound,
  Mail,
  Save,
  Send,
  ShieldCheck,
  TestTube2,
} from "lucide-react";
import { authStorage } from "../lib/api";
import {
  AdminPageHeader,
  FormField,
  LoadingState,
  Notice,
  Section,
  StatCard,
  TextInput,
  Toggle,
} from "./components/AdminUI";

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
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState<"supabase" | "telegram" | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    setStatus("");

    try {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить интеграции.");
    } finally {
      setLoading(false);
    }
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
      setStatus("Настройки интеграций сохранены.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить интеграции.");
    } finally {
      setSaving(false);
    }
  }

  async function testSupabase() {
    setTesting("supabase");
    setStatus("");
    setError("");

    try {
      await request("/api/admin/integrations/test-supabase", "POST");
      setStatus("Проверка Supabase прошла успешно.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Проверка Supabase не прошла.");
    } finally {
      setTesting(null);
    }
  }

  async function testTelegram() {
    setTesting("telegram");
    setStatus("");
    setError("");

    try {
      await request("/api/admin/integrations/test-telegram", "POST");
      setStatus("Тестовое сообщение Telegram отправлено.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Проверка Telegram не прошла.");
    } finally {
      setTesting(null);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const integrationHealth = useMemo(() => {
    const supabaseReady = Boolean(initial?.hasSupabase && initial.supabaseUrl);
    const telegramReady = Boolean(initial?.telegramBotToken && initial.telegramChatId);
    const adminsConfigured = initial?.adminEmails.length ?? 0;
    return { supabaseReady, telegramReady, adminsConfigured };
  }, [initial]);

  if (loading) {
    return (
      <LoadingState
        title="Загрузка интеграций"
        description="Проверяем Supabase, Telegram и служебные параметры."
      />
    );
  }

  return (
    <form onSubmit={save} className="space-y-8">
      <AdminPageHeader
        eyebrow="Служебные подключения"
        title="Интеграции"
        description="Управляйте подключением к Supabase, списком администраторов и Telegram-уведомлениями, не раскрывая секреты прямо на экране."
        actions={
          <>
            <button type="button" onClick={() => void load()} className="admin-button-secondary">
              Обновить
            </button>
            <button type="submit" disabled={saving} className="admin-button-primary">
              <Save className="h-4 w-4" />
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </>
        }
        meta={
          <>
            <StatCard
              icon={ShieldCheck}
              label="Supabase"
              value={integrationHealth.supabaseReady ? "Подключен" : "Не подключен"}
              description="База данных и хранилище медиафайлов для админки."
              tone={integrationHealth.supabaseReady ? "success" : "default"}
            />
            <StatCard
              icon={Mail}
              label="Админы"
              value={integrationHealth.adminsConfigured}
              description="Email-адреса, которым разрешён доступ в систему."
              tone={integrationHealth.adminsConfigured > 0 ? "accent" : "default"}
            />
            <StatCard
              icon={BellRing}
              label="Telegram"
              value={form.telegramEnabled ? "Включен" : "Выключен"}
              description="Отправка уведомлений о новых заявках в чат команды."
              tone={form.telegramEnabled ? "accent" : "default"}
            />
            <StatCard
              icon={KeyRound}
              label="Секреты"
              value={initial?.supabaseAnonKey || initial?.telegramBotToken ? "Настроены" : "Пусто"}
              description="Сами ключи скрыты. Пустое поле при сохранении оставляет текущее значение."
              tone={initial?.supabaseAnonKey || initial?.telegramBotToken ? "success" : "default"}
            />
          </>
        }
      />

      {error ? <Notice tone="danger">{error}</Notice> : null}
      {status ? <Notice tone="success">{status}</Notice> : null}

      <Notice tone="accent" title="Как работает сохранение">
        Если оставить поле с ключом пустым, текущее секретное значение не будет перезаписано.
      </Notice>

      <Section
        title="Supabase и доступ администраторов"
        description="Здесь настраивается база, публичный URL и список email, которым разрешён вход в админку."
        actions={
          <button
            type="button"
            onClick={() => void testSupabase()}
            disabled={testing !== null}
            className="admin-button-secondary"
          >
            <TestTube2 className="h-4 w-4" />
            {testing === "supabase" ? "Проверка..." : "Проверить Supabase"}
          </button>
        }
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Supabase URL">
            <TextInput
              value={form.supabaseUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, supabaseUrl: event.target.value }))}
              placeholder="https://project.supabase.co"
            />
          </FormField>
          <FormField
            label="Admin emails"
            hint="Через запятую"
          >
            <TextInput
              value={form.adminEmails}
              onChange={(event) => setForm((prev) => ({ ...prev, adminEmails: event.target.value }))}
              placeholder="admin@example.com, ops@example.com"
            />
          </FormField>
          <FormField label="Supabase anon key" hint="Оставьте пустым, чтобы сохранить текущий">
            <TextInput
              value={form.supabaseAnonKey}
              onChange={(event) => setForm((prev) => ({ ...prev, supabaseAnonKey: event.target.value }))}
              placeholder="Новый public/anon ключ"
            />
          </FormField>
          <FormField label="Service role key" hint="Оставьте пустым, чтобы сохранить текущий">
            <TextInput
              value={form.supabaseServiceRoleKey}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, supabaseServiceRoleKey: event.target.value }))
              }
              placeholder="Новый service role key"
            />
          </FormField>
        </div>
      </Section>

      <Section
        title="Telegram-уведомления"
        description="Используйте Telegram, чтобы команда быстрее реагировала на новые обращения."
        actions={
          <button
            type="button"
            onClick={() => void testTelegram()}
            disabled={testing !== null}
            className="admin-button-secondary"
          >
            <Send className="h-4 w-4" />
            {testing === "telegram" ? "Проверка..." : "Тест Telegram"}
          </button>
        }
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Telegram bot token" hint="Оставьте пустым, чтобы сохранить текущий">
            <TextInput
              value={form.telegramBotToken}
              onChange={(event) => setForm((prev) => ({ ...prev, telegramBotToken: event.target.value }))}
              placeholder="Новый токен бота"
            />
          </FormField>
          <FormField label="Telegram chat id">
            <TextInput
              value={form.telegramChatId}
              onChange={(event) => setForm((prev) => ({ ...prev, telegramChatId: event.target.value }))}
              placeholder="-1001234567890"
            />
          </FormField>
        </div>

        <Toggle
          checked={form.telegramEnabled}
          onChange={(checked) => setForm((prev) => ({ ...prev, telegramEnabled: checked }))}
          label="Включить уведомления о заявках"
          description="Когда переключатель активен, новые обращения будут отправляться в указанный Telegram-чат."
        />
      </Section>
    </form>
  );
}
