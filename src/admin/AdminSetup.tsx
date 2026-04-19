import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
        throw new Error(
          data?.error ??
            "\u041e\u0448\u0438\u0431\u043a\u0430 \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438",
        );
      }
      setStatus(
        "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0430 Supabase \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0430. \u0422\u0435\u043f\u0435\u0440\u044c \u043c\u043e\u0436\u043d\u043e \u0432\u043e\u0439\u0442\u0438.",
      );
      setTimeout(() => navigate("/admin/login"), 700);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "\u041e\u0448\u0438\u0431\u043a\u0430 \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold">
          {"\u041f\u0435\u0440\u0432\u0438\u0447\u043d\u0430\u044f \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0430 \u0430\u0434\u043c\u0438\u043d\u043a\u0438"}
        </h1>
        <p className="mb-5 text-sm text-stone-500">
          {"\u0417\u0430\u0434\u0430\u0439\u0442\u0435 \u0434\u0430\u043d\u043d\u044b\u0435 Supabase \u043f\u0440\u044f\u043c\u043e \u0438\u0437 \u0430\u0434\u043c\u0438\u043d\u043a\u0438, \u0431\u0435\u0437 \u0440\u0443\u0447\u043d\u043e\u0439 \u043f\u0440\u0430\u0432\u043a\u0438 .env."}
        </p>
        <div className="grid gap-3">
          <input
            className="rounded-md border border-stone-300 px-3 py-2 text-sm"
            placeholder="Supabase URL"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
            required
          />
          <input
            className="rounded-md border border-stone-300 px-3 py-2 text-sm"
            placeholder="Supabase anon key"
            value={supabaseAnonKey}
            onChange={(e) => setSupabaseAnonKey(e.target.value)}
            required
          />
          <input
            className="rounded-md border border-stone-300 px-3 py-2 text-sm"
            placeholder="Supabase service role key"
            value={supabaseServiceRoleKey}
            onChange={(e) => setSupabaseServiceRoleKey(e.target.value)}
            required
          />
          <input
            className="rounded-md border border-stone-300 px-3 py-2 text-sm"
            placeholder="\u041f\u043e\u0447\u0442\u044b \u0430\u0434\u043c\u0438\u043d\u043e\u0432 (\u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043f\u044f\u0442\u0443\u044e)"
            value={adminEmails}
            onChange={(e) => setAdminEmails(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-stone-900 px-4 py-2 text-sm text-white"
          >
            {loading
              ? "\u0421\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u0435..."
              : "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c"}
          </button>
          <Link to="/admin/login" className="text-sm text-stone-500 underline">
            {"\u041a\u043e \u0432\u0445\u043e\u0434\u0443"}
          </Link>
          {status ? <p className="text-sm text-green-700">{status}</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      </form>
    </div>
  );
}
