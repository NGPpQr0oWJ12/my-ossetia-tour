import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mountain, ShieldCheck } from "lucide-react";
import { adminApi } from "../lib/api";
import { Notice, TextInput } from "./components/AdminUI";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsSetup, setNeedsSetup] = useState(false);

  async function checkSetup() {
    try {
      const response = await fetch("/api/setup/status");
      const data = (await response.json()) as { hasSupabase?: boolean };
      setNeedsSetup(!Boolean(data.hasSupabase));
    } catch {
      setNeedsSetup(false);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await adminApi.login(username, password);
      navigate("/admin/leads");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void checkSetup();
  }, []);

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
              Управление брендом
            </div>
            <div className="space-y-4">
              <h1 className="font-serif text-6xl font-extrabold leading-[0.9] text-stone-900">
                Вход в <br /> рабочую <span className="text-accent-600">панель</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-stone-500">
                Управляйте маршрутами, лидами и витриной сайта в едином интерфейсе, который повторяет визуальный язык основного проекта.
              </p>
            </div>
            <div className="grid max-w-xl gap-4 sm:grid-cols-2">
              <div className="admin-soft-surface p-5">
                <Mountain className="mb-4 h-5 w-5 text-accent-600" />
                <h2 className="font-serif text-2xl font-extrabold text-stone-900">Туры</h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                  Редактирование маршрутов, галереи и программы без потери данных.
                </p>
              </div>
              <div className="admin-soft-surface p-5">
                <LockKeyhole className="mb-4 h-5 w-5 text-accent-600" />
                <h2 className="font-serif text-2xl font-extrabold text-stone-900">Контроль</h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                  Быстрый доступ к CRM, интеграциям и системным настройкам.
                </p>
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={onSubmit} className="admin-surface mx-auto w-full max-w-xl p-6 sm:p-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="admin-kicker">Авторизация администратора</div>
              <h2 className="font-serif text-4xl font-extrabold leading-[0.95] text-stone-900">
                Войти в админку
              </h2>
              <p className="text-sm leading-relaxed text-stone-500">
                Используйте логин и пароль администратора для доступа к панели управления.
              </p>
            </div>

            {needsSetup ? (
              <Notice tone="accent" title="Нужна первичная настройка">
                Сначала подключите Supabase. Откройте{" "}
                <Link to="/admin/setup" className="font-semibold underline">
                  первичную настройку
                </Link>
                .
              </Notice>
            ) : null}

            {error ? <Notice tone="danger">{error}</Notice> : null}

            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="admin-kicker">Логин</span>
                <TextInput
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="admin"
                  required
                />
              </label>
              <label className="grid gap-2">
                <span className="admin-kicker">Пароль</span>
                <TextInput
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Введите пароль"
                  required
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" disabled={loading} className="admin-button-primary">
                {loading ? "Вход..." : "Войти"}
                <ArrowRight className="h-4 w-4" />
              </button>
              {needsSetup ? (
                <Link
                  to="/admin/setup"
                  className="text-sm font-medium text-stone-500 transition-colors hover:text-accent-600"
                >
                  Перейти к настройке
                </Link>
              ) : (
                <Link
                  to="/"
                  className="text-sm font-medium text-stone-500 transition-colors hover:text-accent-600"
                >
                  Вернуться на сайт
                </Link>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
