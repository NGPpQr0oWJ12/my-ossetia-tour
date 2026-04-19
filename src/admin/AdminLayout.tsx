import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { authStorage } from "../lib/api";

export default function AdminLayout() {
  const navigate = useNavigate();

  function logout() {
    authStorage.clearToken();
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="bg-stone-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm uppercase tracking-[0.2em] text-white/80">
              {"\u041d\u0430 \u0441\u0430\u0439\u0442"}
            </Link>
            <div className="text-lg font-semibold">
              {"\u0410\u0434\u043c\u0438\u043d-\u043f\u0430\u043d\u0435\u043b\u044c"}
            </div>
          </div>
          <button
            onClick={logout}
            className="rounded-md bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.2em] hover:bg-white/20"
          >
            {"\u0412\u044b\u0439\u0442\u0438"}
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl bg-white p-4 shadow-sm">
          <nav className="flex flex-col gap-2">
            {[
              {
                to: "/admin/leads",
                label:
                  "\u0417\u0430\u044f\u0432\u043a\u0438 CRM",
              },
              { to: "/admin/tours", label: "\u0422\u0443\u0440\u044b" },
              {
                to: "/admin/home",
                label:
                  "\u0413\u043b\u0430\u0432\u043d\u0430\u044f \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430",
              },
              {
                to: "/admin/integrations",
                label:
                  "\u0418\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438",
              },
              {
                to: "/admin/site-settings",
                label:
                  "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u0441\u0430\u0439\u0442\u0430",
              },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm ${
                    isActive ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="rounded-2xl bg-white p-4 shadow-sm md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
