import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Filter,
  Phone,
  RefreshCcw,
  Save,
  SearchSlash,
  Users,
} from "lucide-react";
import { adminApi } from "../lib/api";
import type { Lead, LeadStatus } from "../lib/types";
import {
  AdminPageHeader,
  Badge,
  EmptyState,
  LoadingState,
  Notice,
  StatCard,
  TextArea,
} from "./components/AdminUI";
import { cn } from "../lib/utils";

const STATUS_OPTIONS: Array<{ value: LeadStatus; label: string; tone: "accent" | "success" | "default" | "danger" }> = [
  { value: "new", label: "Новая", tone: "accent" },
  { value: "in_progress", label: "В работе", tone: "default" },
  { value: "booked", label: "Забронирована", tone: "success" },
  { value: "closed_lost", label: "Потеряна", tone: "danger" },
];

type StatusFilter = LeadStatus | "all";

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");

  async function load() {
    setLoading(true);
    setError("");
    setStatus("");

    try {
      const data = await adminApi.getLeads();
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить заявки.");
    } finally {
      setLoading(false);
    }
  }

  async function saveLead(lead: Lead, nextStatus: LeadStatus, managerComment: string) {
    setError("");
    setStatus("");

    try {
      const updated = await adminApi.updateLead(lead.id, nextStatus, managerComment);
      setLeads((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setStatus(`Заявка «${updated.name}» обновлена.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось обновить заявку.");
      throw err;
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const sortedLeads = useMemo(
    () =>
      [...leads].sort(
        (left, right) =>
          new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
      ),
    [leads],
  );

  const filteredLeads = useMemo(
    () => sortedLeads.filter((lead) => filter === "all" || lead.status === filter),
    [filter, sortedLeads],
  );

  const counts = useMemo(
    () => ({
      all: leads.length,
      new: leads.filter((lead) => lead.status === "new").length,
      inProgress: leads.filter((lead) => lead.status === "in_progress").length,
      booked: leads.filter((lead) => lead.status === "booked").length,
    }),
    [leads],
  );

  if (loading) {
    return <LoadingState title="Загрузка заявок" description="Подтягиваем текущие обращения из CRM." />;
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="CRM"
        title="Заявки и коммуникация"
        description="Следите за новыми обращениями, быстро меняйте статус сделки и фиксируйте договорённости прямо в карточке."
        actions={
          <button type="button" onClick={() => void load()} className="admin-button-secondary">
            <RefreshCcw className="h-4 w-4" />
            Обновить
          </button>
        }
        meta={
          <>
            <StatCard
              icon={Users}
              label="Всего заявок"
              value={counts.all}
              description="Общий объём обращений, доступных в CRM."
              tone={counts.all > 0 ? "accent" : "default"}
            />
            <StatCard
              icon={CalendarClock}
              label="Новые"
              value={counts.new}
              description="Требуют первичной реакции менеджера."
              tone={counts.new > 0 ? "accent" : "default"}
            />
            <StatCard
              icon={CheckCircle2}
              label="В работе"
              value={counts.inProgress}
              description="Клиенты, по которым уже идёт диалог."
            />
            <StatCard
              icon={CircleDollarSign}
              label="Забронировано"
              value={counts.booked}
              description="Заявки, дошедшие до результата."
              tone={counts.booked > 0 ? "success" : "default"}
            />
          </>
        }
      />

      {error ? <Notice tone="danger">{error}</Notice> : null}
      {status ? <Notice tone="success">{status}</Notice> : null}

      <div className="admin-soft-surface p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="admin-kicker mb-2">Фильтр</div>
            <p className="text-sm text-stone-500">
              Оставьте на экране только нужный этап воронки, чтобы быстрее обрабатывать обращения.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-stone-400" />
            {[
              { value: "all" as const, label: "Все", count: counts.all },
              { value: "new" as const, label: "Новые", count: counts.new },
              { value: "in_progress" as const, label: "В работе", count: counts.inProgress },
              { value: "booked" as const, label: "Забронированы", count: counts.booked },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300",
                  filter === item.value
                    ? "border-accent-500/30 bg-accent-500 text-white shadow-[0_16px_30px_rgba(188,141,89,0.28)]"
                    : "border-stone-200/80 bg-white/90 text-stone-500 hover:border-stone-300 hover:text-stone-900",
                )}
              >
                <span>{item.label}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px]",
                    filter === item.value ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500",
                  )}
                >
                  {item.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <EmptyState
          icon={SearchSlash}
          title="Заявок для выбранного фильтра нет"
          description="Попробуйте переключить статус или обновить данные, если обращения появились только что."
          action={
            <button type="button" onClick={() => setFilter("all")} className="admin-button-secondary">
              Показать все
            </button>
          }
        />
      ) : (
        <div className="grid gap-5">
          {filteredLeads.map((lead) => (
            <div key={lead.id}>
              <LeadCard lead={lead} onSave={saveLead} />
            </div>
          ))}
        </div>
      )}
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

  const statusMeta = STATUS_OPTIONS.find((item) => item.value === status) ?? STATUS_OPTIONS[0];

  async function save() {
    setSaving(true);
    try {
      await onSave(lead, status, comment);
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="admin-soft-surface overflow-hidden">
      <div className="grid gap-6 p-5 lg:grid-cols-[1.1fr_0.9fr] lg:p-6">
        <div className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-serif text-3xl font-extrabold leading-none text-stone-900">
                  {lead.name}
                </h2>
                <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
                <Badge>{lead.source_page}</Badge>
                <span>{new Date(lead.created_at).toLocaleString("ru-RU")}</span>
              </div>
            </div>

            <a href={`tel:${lead.phone}`} className="admin-button-secondary">
              <Phone className="h-4 w-4" />
              Позвонить
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="admin-subtle-panel p-4">
              <div className="admin-kicker mb-2">Телефон</div>
              <a href={`tel:${lead.phone}`} className="text-sm font-semibold text-stone-900 hover:text-accent-600">
                {lead.phone}
              </a>
            </div>
            <div className="admin-subtle-panel p-4">
              <div className="admin-kicker mb-2">Источник</div>
              <p className="text-sm text-stone-700">
                {lead.source_page}
                {lead.tour_id ? ` · Тур #${lead.tour_id}` : ""}
              </p>
            </div>
          </div>

          <div className="admin-subtle-panel p-4">
            <div className="admin-kicker mb-2">Комментарий клиента</div>
            <p className="text-sm leading-relaxed text-stone-700">
              {lead.message?.trim() || "Клиент оставил только контактные данные без дополнительного сообщения."}
            </p>
          </div>
        </div>

        <div className="admin-subtle-panel flex flex-col gap-4 p-4 sm:p-5">
          <div className="space-y-1">
            <div className="admin-kicker">Обработка</div>
            <h3 className="font-serif text-2xl font-extrabold text-stone-900">Статус и заметки</h3>
            <p className="text-sm text-stone-500">
              Сохраните текущий этап сделки и коротко зафиксируйте договорённости.
            </p>
          </div>

          <label className="grid gap-2">
            <span className="admin-kicker">Статус заявки</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as LeadStatus)}
              className="admin-input"
            >
              {STATUS_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="admin-kicker">Комментарий менеджера</span>
            <TextArea
              rows={5}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Например: созвонились, отправили программу, ждём подтверждение по дате."
              className="min-h-[9rem]"
            />
          </label>

          <button onClick={() => void save()} disabled={saving} className="admin-button-primary">
            <Save className="h-4 w-4" />
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    </article>
  );
}
