import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Database, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { Notice, TextInput } from "./components/AdminUI";

export default function AdminSetup() {
  const navigate = useNavigate();
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [supabaseServiceRoleKey, setSupabaseServiceRoleKey] = useState("");
  const [adminEmails, setAdminEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setStatus("");

    try {
      const response = await fetch("/api/setup/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supabaseUrl,
          supabaseAnonKey,
          supabaseServiceRoleKey,
          adminEmails: adminEmails
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error ?? "Ошибка настройки.");
      }

      setStatus("Настройка Supabase сохранена. Можно переходить ко входу.");
      setTimeout(() => navigate("/admin/login"), 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка настройки.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f4f0ea_0%,#f8f6f2_35%,#f7f5f1_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-8rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_rgba(205,165,119,0.26),transparent_60%)]" />
        <div className="absolute bottom-[-10rem] left-[-8rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,_rgba(28,25,23,0.06),transparent_65%)]" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden lg:block">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/20 bg-accent-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-accent-700">
              <ShieldCheck className="h-4 w-4" />
              Первичная настройка
            </div>
            <div className="space-y-4">
              <h1 className="font-serif text-6xl font-extrabold leading-[0.9] text-stone-900">
                Подключите <br /> основу <span className="text-accent-600">админки</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-stone-500">
                Укажите параметры Supabase и список администраторов, чтобы включить рабочую панель без ручной правки конфигурации.
              </p>
            </div>
            <div className="grid max-w-xl gap-4 sm:grid-cols-2">
              <div className="admin-soft-surface p-5">
                <Database className="mb-4 h-5 w-5 text-accent-600" />
                <h2 className="font-serif text-2xl font-extrabold text-stone-900">Supabase</h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                  База, хранилище изображений и служебные таблицы для каталога и CRM.
                </p>
              </div>
              <div className="admin-soft-surface p-5">
                <Mail className="mb-4 h-5 w-5 text-accent-600" />
                <h2 className="font-serif text-2xl font-extrabold text-stone-900">Доступ</h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                  Добавьте email-адреса администраторов, которым будет разрешён вход.
                </p>
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={onSubmit} className="admin-surface mx-auto w-full max-w-xl p-6 sm:p-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="admin-kicker">Bootstrap конфигурации</div>
              <h2 className="font-serif text-4xl font-extrabold leading-[0.95] text-stone-900">
                Первичная настройка
              </h2>
              <p className="text-sm leading-relaxed text-stone-500">
                Все поля обязательны. После сохранения система вернёт вас к экрану входа.
              </p>
            </div>

            {status ? <Notice tone="success">{status}</Notice> : null}
            {error ? <Notice tone="danger">{error}</Notice> : null}

            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="admin-kicker">Supabase URL</span>
                <TextInput
                  value={supabaseUrl}
                  onChange={(event) => setSupabaseUrl(event.target.value)}
                  placeholder="https://project.supabase.co"
                  required
                />
              </label>
              <label className="grid gap-2">
                <span className="admin-kicker">Supabase anon key</span>
                <TextInput
                  value={supabaseAnonKey}
                  onChange={(event) => setSupabaseAnonKey(event.target.value)}
                  placeholder="Public anon key"
                  required
                />
              </label>
              <label className="grid gap-2">
                <span className="admin-kicker">Service role key</span>
                <TextInput
                  value={supabaseServiceRoleKey}
                  onChange={(event) => setSupabaseServiceRoleKey(event.target.value)}
                  placeholder="Service role key"
                  required
                />
              </label>
              <label className="grid gap-2">
                <span className="admin-kicker">Почты администраторов</span>
                <TextInput
                  value={adminEmails}
                  onChange={(event) => setAdminEmails(event.target.value)}
                  placeholder="admin@example.com, ops@example.com"
                />
              </label>
            </div>

            <div className="admin-subtle-panel flex items-start gap-3 p-4">
              <KeyRound className="mt-0.5 h-4 w-4 text-accent-600" />
              <p className="text-sm leading-relaxed text-stone-600">
                Секретные ключи записываются в конфигурацию приложения. Проверьте их перед сохранением.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" disabled={loading} className="admin-button-primary">
                {loading ? "Сохранение..." : "Сохранить"}
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                to="/admin/login"
                className="text-sm font-medium text-stone-500 transition-colors hover:text-accent-600"
              >
                Ко входу
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
