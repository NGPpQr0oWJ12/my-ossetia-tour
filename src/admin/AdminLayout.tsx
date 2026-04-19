import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  LayoutDashboard,
  Link as LinkIcon,
  LogOut,
  Map,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { authStorage } from "../lib/api";
import { cn } from "../lib/utils";

const navItems = [
  {
    to: "/admin/leads",
    label: "CRM заявки",
    description: "Новые обращения, статусы и комментарии менеджера.",
    icon: Users,
  },
  {
    to: "/admin/tours",
    label: "Туры",
    description: "Маршруты, галерея, программа и SEO.",
    icon: Map,
  },
  {
    to: "/admin/home",
    label: "Главная страница",
    description: "Hero-блок, популярные туры и финальный CTA.",
    icon: LayoutDashboard,
  },
  {
    to: "/admin/integrations",
    label: "Интеграции",
    description: "Supabase, Telegram и служебные подключения.",
    icon: LinkIcon,
  },
  {
    to: "/admin/site-settings",
    label: "Настройки сайта",
    description: "Контакты, тексты и общие данные по сайту.",
    icon: Settings,
  },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeItem = navItems.find((item) => location.pathname.startsWith(item.to));

  function logout() {
    authStorage.clearToken();
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4f0ea_0%,#f8f6f2_30%,#f7f5f1_100%)] text-stone-900 selection:bg-accent-500 selection:text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute right-[-8rem] top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_rgba(205,165,119,0.26),transparent_65%)]" />
        <div className="absolute bottom-[-10rem] left-[-8rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,_rgba(28,25,23,0.06),transparent_65%)]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <div className="flex w-full items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4 sm:gap-6">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-stone-500 transition-colors hover:text-accent-600"
            >
              <span>На сайт</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <div className="hidden h-4 w-px bg-stone-200 sm:block" />
            <div className="min-w-0">
              <div className="truncate font-serif text-lg font-extrabold tracking-tight text-stone-900 sm:text-xl">
                My Ossetia Admin
              </div>
            </div>
          </div>

          <button onClick={logout} className="admin-button-secondary shrink-0 px-4 py-2.5">
            <LogOut className="h-4 w-4" />
            Выйти
          </button>
        </div>
      </header>

      <div className="relative grid w-full gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8 lg:py-8">
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className="admin-surface p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(205,165,119,0.18),transparent_42%)]" />
            <div className="relative space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/20 bg-accent-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-accent-700">
                <Sparkles className="h-3.5 w-3.5" />
                Рабочая зона
              </div>
              <div className="space-y-2">
                <h1 className="font-serif text-3xl font-extrabold leading-[0.95] text-stone-900">
                  {activeItem?.label ?? "Панель управления"}
                </h1>
                <p className="text-sm leading-relaxed text-stone-500">
                  {activeItem?.description ??
                    "Организуйте контент, следите за заявками и поддерживайте сайт в актуальном состоянии."}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="admin-subtle-panel p-4">
                  <div className="admin-kicker mb-2">Подход</div>
                  <p className="text-sm leading-relaxed text-stone-600">
                    Основные действия выведены наверх, а формы разбиты на короткие смысловые блоки.
                  </p>
                </div>
                <div className="admin-subtle-panel p-4">
                  <div className="admin-kicker mb-2">Рекомендация</div>
                  <p className="text-sm leading-relaxed text-stone-600">
                    Держите в публикации только готовые маршруты, а черновики используйте для подготовки новых туров.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <nav className="admin-surface flex gap-3 overflow-x-auto p-3 lg:flex-col lg:overflow-visible">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "group min-w-[15rem] rounded-[1.4rem] border px-4 py-4 transition-all duration-300 lg:min-w-0",
                    isActive
                      ? "border-stone-900 bg-stone-900 text-white shadow-[0_18px_35px_rgba(28,25,23,0.24)]"
                      : "border-transparent bg-white/60 text-stone-500 hover:border-stone-200 hover:bg-white/90 hover:text-stone-900",
                  )
                }
              >
                {({ isActive }) => (
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border",
                        isActive
                          ? "border-white/20 bg-white/10 text-white"
                          : "border-stone-200/80 bg-white text-accent-600 group-hover:border-accent-500/30",
                      )}
                    >
                      <item.icon className="h-[18px] w-[18px]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">{item.label}</div>
                      <div
                        className={cn(
                          "mt-1 text-xs leading-relaxed",
                          isActive ? "text-white/70" : "text-stone-400",
                        )}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>

        <motion.main
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="admin-surface min-h-[70vh] p-5 sm:p-6 lg:p-8 xl:p-10"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
