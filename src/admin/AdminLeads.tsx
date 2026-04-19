import { useEffect, useState } from "react";
import { adminApi } from "../lib/api";
import type { Lead, LeadStatus } from "../lib/types";

const STATUSES: LeadStatus[] = ["new", "in_progress", "booked", "closed_lost"];

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.getLeads();
      setLeads(data);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0438",
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveLead(lead: Lead, status: LeadStatus, managerComment: string) {
    try {
      const updated = await adminApi.updateLead(lead.id, status, managerComment);
      setLeads((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043e\u0431\u043d\u043e\u0432\u0438\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443",
      );
    }
  }

  useEffect(() => {
    void load();
  }, []);

  if (loading)
    return <p>{"\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0437\u0430\u044f\u0432\u043e\u043a..."}</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {"CRM \u0437\u0430\u044f\u0432\u043a\u0438"}
        </h1>
        <button
          onClick={() => void load()}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
        >
          {"\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c"}
        </button>
      </div>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <div className="space-y-4">
        {leads.map((lead) => (
          <div key={lead.id}>
            <LeadCard lead={lead} onSave={saveLead} />
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadCard({
  lead,
  onSave,
}: {
  lead: Lead;
  onSave: (lead: Lead, status: LeadStatus, managerComment: string) => Promise<void>;
}) {
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [comment, setComment] = useState(lead.manager_comment ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await onSave(lead, status, comment);
    setSaving(false);
  }

  return (
    <article className="rounded-xl border border-stone-200 p-4">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-medium">{lead.name}</h2>
        <span className="rounded bg-stone-100 px-2 py-1 text-xs">{lead.source_page}</span>
        <span className="text-xs text-stone-500">{new Date(lead.created_at).toLocaleString()}</span>
      </div>
      <p className="text-sm">
          <strong>{"\u0422\u0435\u043b\u0435\u0444\u043e\u043d:"}</strong> {lead.phone}
      </p>
      {lead.message ? (
        <p className="mt-1 text-sm">
          <strong>{"\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439:"}</strong> {lead.message}
        </p>
      ) : null}
      <div className="mt-3 grid gap-2 md:grid-cols-[220px_1fr_auto]">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as LeadStatus)}
          className="rounded-md border border-stone-300 px-2 py-2 text-sm"
        >
          {STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="rounded-md border border-stone-300 px-2 py-2 text-sm"
          placeholder="\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439 \u043c\u0435\u043d\u0435\u0434\u0436\u0435\u0440\u0430"
        />
        <button
          onClick={() => void save()}
          disabled={saving}
          className="rounded-md bg-stone-900 px-3 py-2 text-xs uppercase tracking-[0.15em] text-white"
        >
          {saving
            ? "\u0421\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u0435..."
            : "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c"}
        </button>
      </div>
    </article>
  );
}
