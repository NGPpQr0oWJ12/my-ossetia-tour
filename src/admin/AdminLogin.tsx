import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminApi } from "../lib/api";

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
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "\u041e\u0448\u0438\u0431\u043a\u0430 \u0432\u0445\u043e\u0434\u0430",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void checkSetup();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-semibold">
          {"\u0412\u0445\u043e\u0434 \u0432 \u0430\u0434\u043c\u0438\u043d\u043a\u0443"}
        </h1>
        <p className="mb-6 text-sm text-stone-500">
          {"\u0412\u043e\u0439\u0434\u0438\u0442\u0435 \u043f\u043e \u043b\u043e\u0433\u0438\u043d\u0443 \u0438 \u043f\u0430\u0440\u043e\u043b\u044e \u0430\u0434\u043c\u0438\u043d\u0430."}
        </p>
        {needsSetup ? (
          <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">
            {"\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u0442\u0435 Supabase. \u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 "}
            <Link to="/admin/setup" className="underline">
              {"\u043f\u0435\u0440\u0432\u0438\u0447\u043d\u0443\u044e \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0443"}
            </Link>
            .
          </p>
        ) : null}
        <div className="space-y-4">
          <input
            className="w-full rounded-lg border border-stone-300 px-3 py-2"
            type="text"
            placeholder="admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="w-full rounded-lg border border-stone-300 px-3 py-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-stone-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading
              ? "\u0412\u0445\u043e\u0434..."
              : "\u0412\u043e\u0439\u0442\u0438"}
          </button>
        </div>
      </form>
    </div>
  );
}
