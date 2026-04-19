import { FormEvent, useEffect, useState } from "react";
import { adminApi } from "../lib/api";

const FIELDS: Array<{ key: string; label: string; rows?: number }> = [
  { key: "contacts_title", label: "Заголовок страницы контактов" },
  { key: "contacts_subtitle", label: "Подзаголовок контактов", rows: 2 },
  { key: "office_text", label: "Адрес офиса", rows: 3 },
  { key: "phones_text", label: "Телефоны (по строкам)", rows: 3 },
  { key: "email_text", label: "Email" },
  { key: "schedule_text", label: "Режим работы", rows: 3 },
  { key: "whatsapp_url", label: "Ссылка WhatsApp" },
  { key: "telegram_url", label: "Ссылка Telegram" },
  { key: "guide_name", label: "Имя гида" },
  { key: "guide_bio", label: "Текст о гиде", rows: 5 },
];

export default function AdminSiteSettings() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      setForm(await adminApi.getSiteSettings());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки настроек");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    setError("");
    try {
      await adminApi.updateSiteSettings(form);
      setStatus("Настройки сайта сохранены");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  if (loading) return <p>Загрузка настроек...</p>;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Настройки сайта</h1>
      </div>
      <p className="text-sm text-stone-500">
        Здесь редактируются контакты, ссылки, тексты и другие общие настройки публичных страниц.
      </p>

      <div className="grid gap-3">
        {FIELDS.map((field) => (
          <label key={field.key} className="grid gap-1">
            <span className="text-sm text-stone-700">{field.label}</span>
            {field.rows ? (
              <textarea
                rows={field.rows}
                className="rounded-md border border-stone-300 px-3 py-2 text-sm"
                value={form[field.key] ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
              />
            ) : (
              <input
                className="rounded-md border border-stone-300 px-3 py-2 text-sm"
                value={form[field.key] ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
              />
            )}
          </label>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm text-white"
        >
          {saving ? "Сохранение..." : "Сохранить настройки"}
        </button>
        {status ? <span className="text-sm text-green-700">{status}</span> : null}
        {error ? <span className="text-sm text-red-600">{error}</span> : null}
      </div>
    </form>
  );
}
