import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  GripVertical,
  Plus,
  Phone,
  RefreshCcw,
  Save,
  SearchSlash,
  Settings2,
  Trash2,
  Users,
  X,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  Columns2,
  LayoutList,
  Download,
  Search,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import * as XLSX from "xlsx";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  rectIntersection,
  pointerWithin,
  getFirstCollision,
  CollisionDetection,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { adminApi } from "../lib/api";
import type { Lead, LeadStage } from "../lib/types";
import {
  AdminModal,
  AdminPageHeader,
  Badge,
  EmptyState,
  LoadingState,
  Notice,
  StatCard,
  TextArea,
  TextInput,
  FormField,
} from "./components/AdminUI";
import { cn } from "../lib/utils";

// --- Mapping Helpers ---

const SOURCE_MAP: Record<string, string> = {
  "/": "Главная страница",
  "/contacts": "Страница контактов",
  "/tours": "Каталог всех туров",
};

function getSourceName(source: string | null, tourTitle?: string) {
  if (!source) return "Неизвестный источник";
  if (SOURCE_MAP[source]) return SOURCE_MAP[source];
  if (tourTitle) return `Тур: ${tourTitle}`;
  return source;
}

// --- Components ---

function KanbanCard({ 
  lead, 
  tourTitle, 
  isSaving,
  onClick 
}: { 
  lead: Lead; 
  tourTitle?: string; 
  isSaving?: boolean;
  onClick: () => void;
  [key: string]: any;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: {
      type: "Lead",
      lead,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : (isSaving ? 0.7 : 1),
    filter: isSaving ? 'grayscale(0.5)' : 'none',
  };
  const tour = lead.tour_id ? lead.tour_id : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative flex flex-col gap-3 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm transition-all hover:border-accent-500/40 hover:shadow-xl cursor-grab active:cursor-grabbing",
        isDragging && "z-50 shadow-2xl scale-[1.02] border-accent-500",
        isSaving && "animate-pulse"
      )}
      onClick={(e) => {
        if (transform && (Math.abs(transform.x) > 5 || Math.abs(transform.y) > 5)) return;
        onClick();
      }}
    >
      {/* Quick Move Trigger */}
      <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-white shadow-lg border-2 border-white">
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>

      <div className="flex items-start justify-between gap-3">
        <h4 className="font-serif text-base font-black text-stone-900 tracking-tight leading-none line-clamp-1">
          {lead.name}
        </h4>
        <div className="flex items-center gap-2">
          {isSaving && <RefreshCcw className="h-3 w-3 animate-spin text-accent-500" />}
          <div className="text-stone-300 group-hover:text-stone-500 transition-colors shrink-0">
            <GripVertical className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          <div className="flex items-center gap-1.5 rounded-lg bg-stone-100/80 px-2 py-1 text-[9px] font-black text-stone-500 border border-stone-200/40 shadow-sm">
            <ExternalLink className="h-3 w-3 text-stone-400" />
            <span className="uppercase tracking-widest">{getSourceName(lead.source_page, tourTitle)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-sm font-bold text-stone-800">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-50 border border-stone-200/50">
            <Phone className="h-3.5 w-3.5 text-stone-500" />
          </div>
          <span className="tracking-tight">{lead.phone}</span>
        </div>
      </div>

      {lead.manager_comment && (
        <div className="mt-1 flex flex-col gap-1.5 rounded-xl bg-stone-50/50 border border-stone-100 p-3 text-[10px] text-stone-700 shadow-sm">
          <div className="flex items-center gap-1.5 font-black text-stone-900/40 uppercase tracking-[0.1em] text-[8px]">
            <MessageSquare className="h-2.5 w-2.5" />
            Заметка
          </div>
          <p className="line-clamp-2 leading-relaxed font-medium opacity-90">{lead.manager_comment}</p>
        </div>
      )}
      
      <div className="flex items-center justify-between mt-1 pt-3 border-t border-stone-100/50">
         <div className="flex items-center gap-2 text-[9px] text-stone-400 font-black uppercase tracking-[0.2em]">
          <CalendarClock className="h-3 w-3" />
          <span>{new Date(lead.created_at).toLocaleDateString("ru-RU")}</span>
        </div>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-50 text-stone-300 group-hover:bg-accent-600 group-hover:text-white transition-all shadow-sm">
          <ChevronRight className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({ 
  stage, 
  leads, 
  tours,
  savingIds,
  onLeadClick,
}: { 
  stage: LeadStage; 
  leads: Lead[]; 
  tours: any[];
  savingIds: Set<number>;
  onLeadClick: (lead: Lead) => void;
  [key: string]: any;
}) {
  const {
    setNodeRef,
    isOver,
  } = useSortable({
    id: `column-${stage.id}`,
    data: {
      type: "Column",
      stage,
    },
  });

  return (
    <div className="flex h-full w-[320px] shrink-0 flex-col gap-4">
      <div className="flex flex-col gap-1.5 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="h-3 w-3 rounded-full ring-[6px] ring-white shadow-lg border border-black/5" 
              style={{ backgroundColor: stage.color }} 
            />
            <h3 className="font-serif text-lg font-black text-stone-900 tracking-tighter">{stage.title}</h3>
          </div>
          <span className="rounded-lg bg-white border border-stone-200 px-2.5 py-1 text-[10px] font-black text-stone-900 shadow-sm">
            {leads.length}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex h-[560px] flex-1 flex-col gap-4 rounded-3xl border-2 border-transparent p-4 transition-all duration-300",
          isOver ? "bg-accent-500/5 border-accent-500/20 scale-[1.01] shadow-xl ring-2 ring-accent-500/5" : "bg-stone-100/30 shadow-inner"
        )}
      >
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-4 min-h-full pb-10 relative overflow-y-auto pr-2 scrollbar-hide">
            {leads.map((lead) => {
              const tour = tours.find(t => t.id === lead.tour_id);
              return (
                <KanbanCard 
                  key={lead.id} 
                  lead={lead} 
                  tourTitle={tour?.title}
                  isSaving={savingIds.has(lead.id)}
                  onClick={() => onLeadClick(lead)} 
                />
              );
            })}
            
            {/* Visual Drop Area / Placeholder */}
            {isOver && leads.length === 0 && (
              <div className="h-32 w-full rounded-[2rem] border-2 border-dashed border-accent-500/30 bg-accent-500/5 animate-pulse" />
            )}
            
            {leads.length === 0 && !isOver && (
              <div className="flex flex-1 flex-col items-center justify-center p-12 text-center opacity-30 mt-20">
                <div className="mb-6 h-12 w-12 rounded-full border-2 border-dashed border-stone-300 flex items-center justify-center text-stone-300">
                  <Plus className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                  Ожидание
                </p>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

function LeadTableView({ 
  leads, 
  stages, 
  tours, 
  onLeadClick 
}: { 
  leads: Lead[]; 
  stages: LeadStage[]; 
  tours: any[]; 
  onLeadClick: (lead: Lead) => void;
}) {
  return (
    <div className="admin-soft-surface overflow-hidden border border-stone-200/60 shadow-xl rounded-3xl bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/50">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Дата</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Клиент</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Тур / Услуга</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Стадия</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Источник</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {leads.map((lead) => {
              const stage = stages.find(s => s.id === lead.stage_id);
              const tour = tours.find(t => t.id === lead.tour_id);
              return (
                <tr 
                  key={lead.id} 
                  className="group hover:bg-accent-500/5 transition-colors cursor-pointer"
                  onClick={() => onLeadClick(lead)}
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2 text-stone-400">
                      <CalendarClock className="h-3.5 w-3.5" />
                      <span className="text-xs font-bold font-mono">{new Date(lead.created_at).toLocaleDateString("ru-RU")}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-serif text-base font-black text-stone-900">
                    <div className="flex flex-col">
                      <span>{lead.name}</span>
                      <span className="text-[11px] font-sans font-bold text-stone-400 tracking-tight">{lead.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <Badge tone={tour ? "accent" : "default"} className="py-0.5 px-2.5 text-[10px]">
                        {tour?.title || "Общий запрос"}
                       </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: stage?.color }} />
                      <span className="text-[10px] font-black uppercase tracking-wider text-stone-600">{stage?.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{getSourceName(lead.source_page || null, tour?.title)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="h-8 w-8 flex items-center justify-center rounded-full bg-stone-50 text-stone-300 group-hover:bg-white group-hover:text-accent-600 group-hover:shadow-md transition-all">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stages, setStages] = useState<LeadStage[]>([]);
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  
  // Selection
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeId, setActiveId] = useState<number | string | null>(null);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());

  // View & Filter States
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState("");

  // Edit states
  const [editComment, setEditComment] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // Increased to prevent accidental drags when clicking
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Improved Collision Detection for 100% hit rate
  const customCollisionStrategy: CollisionDetection = (args) => {
    // 1. First, check for rect intersections (the most reliable way for Kanban)
    const intersections = rectIntersection(args);
    
    // 2. If no direct rect intersections, fallback to closest corners
    const collisions = intersections.length > 0 ? intersections : closestCorners(args);
    
    // Find the first collision that is a column or a lead
    const overId = getFirstCollision(collisions, 'id');
    
    if (overId != null) {
      // If we're over a lead, we might want to return that to sort within the column
      // If we're over an empty column, this will return the column ID
      return collisions;
    }

    return [];
  };

  async function loadData() {
    setLoading(true);
    try {
      const [leadsData, stagesData, toursData] = await Promise.all([
        adminApi.getLeads(),
        adminApi.getLeadStages(),
        adminApi.getTours(),
      ]);
      setLeads(leadsData);
      setStages(stagesData);
      setTours(toursData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const onDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
    const lead = leads.find(l => l.id === event.active.id);
    if (lead) setActiveLead(lead);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData || !overData) return;

    const activeLead = activeData.lead as Lead;
    let overStageId: number;

    if (overData.type === 'Column') {
      overStageId = overData.stage.id;
    } else {
      overStageId = (overData.lead as Lead).stage_id;
    }

    // If moving to a different stage, update state immediately for smooth UI
    if (activeLead.stage_id !== overStageId) {
      setLeads((prev) => {
        return prev.map((l) => {
          if (l.id === activeId) {
            return { ...l, stage_id: overStageId };
          }
          return l;
        });
      });
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveLead(null);

    if (!over) return;

    const activeId = active.id as number;
    const overData = over.data.current;
    let targetStageId: number | null = null;
    
    if (overData?.type === "Column") {
      targetStageId = overData.stage.id;
    } else if (overData?.type === "Lead") {
      targetStageId = (overData.lead as Lead).stage_id;
    }

    if (targetStageId !== null) {
      // Sync with server only at the end
      setSavingIds(prev => new Set(prev).add(activeId as number));
      
      try {
        const updated = await adminApi.updateLead(activeId as number, { stage_id: targetStageId });
        if (updated) {
          setLeads(prev => prev.map(l => l.id === updated.id ? { ...l, ...updated } : l));
        }
        setStatus("Сохранено");
        setTimeout(() => setStatus(""), 2000);
      } catch (err) {
        setError("Ошибка синхронизации. Пожалуйста, обновите страницу.");
        setTimeout(() => setError(""), 4000);
      } finally {
        setSavingIds(prev => {
          const next = new Set(prev);
          next.delete(activeId as number);
          return next;
        });
      }
    }
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setEditComment(lead.manager_comment ?? "");
  };

  const saveLeadDetails = async () => {
    if (!selectedLead) return;
    setEditSaving(true);
    try {
      const updated = await adminApi.updateLead(selectedLead.id, { 
        manager_comment: editComment 
      });
      setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
      setSelectedLead(updated);
      setStatus("Данные сохранены");
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      setError("Ошибка сохранения");
    } finally {
      setEditSaving(false);
    }
  };

  const handleExport = () => {
    try {
      const dataToExport = leads.map(lead => {
        const tour = tours.find(t => t.id === lead.tour_id);
        const stage = stages.find(s => s.id === lead.stage_id);
        return {
          "Дата": new Date(lead.created_at).toLocaleDateString("ru-RU"),
          "Имя клиента": lead.name,
          "Телефон": lead.phone,
          "Тур": tour?.title || "Общий запрос",
          "Этап воронки": stage?.title || "Не определен",
          "Источник": getSourceName(lead.source_page || null, tour?.title),
          "Сообщение": lead.message || "",
          "Заметка менеджера": lead.manager_comment || ""
        };
      });

      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Заявки");
      
      if (dataToExport.length > 0) {
        const maxWidths = Object.keys(dataToExport[0]).map(key => {
           return Math.max(
             key.length, 
             ...dataToExport.map(row => String(row[key as keyof typeof row]).length)
           );
        });
        ws['!cols'] = maxWidths.map(w => ({ wch: w + 5 }));
      }

      XLSX.writeFile(wb, `leads_report_${new Date().toISOString().split('T')[0]}.xlsx`);
      setStatus("Отчет Excel успешно сформирован");
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      setError("Не удалось создать Excel файл");
    }
  };

  const filteredLeads = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return leads;
    return leads.filter(l => 
      l.name.toLowerCase().includes(q) || 
      l.phone.includes(q) || 
      (l.manager_comment || "").toLowerCase().includes(q)
    );
  }, [leads, searchQuery]);

  if (loading) {
    return <LoadingState title="Загрузка CRM" description="Синхронизируем воронку продаж..." />;
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <AdminPageHeader
        title="Управление заявками"
        actions={
          <div className="flex flex-wrap items-center gap-4">
             <div className="relative group w-64 text-stone-900 font-bold">
              <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-bold text-stone-900 group-focus-within:text-accent-500 transition-colors" />
              <TextInput
                placeholder="Быстрый поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-stone-50/50 focus:bg-white text-xs py-2 transition-all shadow-sm rounded-xl border-stone-200/50"
              />
            </div>

            <div className="flex items-center gap-1.5 rounded-xl bg-stone-100 p-1 shadow-inner">
               <button 
                onClick={() => setViewMode('kanban')} 
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                  viewMode === 'kanban' ? "bg-white text-stone-900 shadow-md" : "text-stone-400 hover:text-stone-600"
                )}
              >
                <Columns2 className="h-4 w-4" />
                Канбан
              </button>
               <button 
                onClick={() => setViewMode('table')} 
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                  viewMode === 'table' ? "bg-white text-stone-900 shadow-md" : "text-stone-400 hover:text-stone-600"
                )}
              >
                <LayoutList className="h-4 w-4" />
                Список
              </button>
            </div>

            <div className="h-6 w-px bg-stone-200 hidden sm:block" />

            <button onClick={handleExport} className="admin-button-primary bg-emerald-600 border-emerald-700/20 hover:bg-emerald-700 py-2">
              <Download className="h-4 w-4" />
              Экспорт
            </button>
            
            <button onClick={() => setIsSettingsOpen(true)} className="admin-button-secondary bg-white py-2">
              <Settings2 className="h-4 w-4" />
              Воронка
            </button>
          </div>
        }
      />

      {error ? <Notice tone="danger">{error}</Notice> : null}
      {status ? <Notice tone="success">{status}</Notice> : null}

      {viewMode === 'kanban' ? (
        <div className="flex-1 w-full overflow-hidden pb-4">
          <div className="flex gap-6 h-full min-h-[580px] w-full overflow-x-auto pr-4 scrollbar-hide">
            <DndContext
              sensors={sensors}
              collisionDetection={customCollisionStrategy}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
            >
              {stages.map((stage) => (
                <KanbanColumn
                  key={stage.id}
                  stage={stage}
                  leads={leads.filter((l) => l.stage_id === stage.id)}
                  tours={tours}
                  savingIds={savingIds}
                  onLeadClick={handleLeadClick}
                />
              ))}

              <DragOverlay 
                dropAnimation={{
                  sideEffects: defaultDropAnimationSideEffects({
                    styles: {
                      active: { opacity: '0.4' },
                    },
                  }),
                }}
                style={{ pointerEvents: 'none' }}
              >
                {activeLead ? (
                  <div className="flex flex-col gap-3 rounded-2xl border-2 border-accent-500 bg-white p-5 shadow-2xl rotate-1 scale-105 cursor-grabbing w-[280px]">
                     <div className="flex items-start justify-between gap-2">
                       <h4 className="font-serif text-base font-black text-stone-900 tracking-tighter line-clamp-1">{activeLead.name}</h4>
                       <GripVertical className="h-4 w-4 text-accent-500" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <Phone className="h-3.5 w-3.5" />
                      <span className="font-bold">{activeLead.phone}</span>
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>

            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex h-[560px] w-48 shrink-0 flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-stone-200/50 bg-stone-50/20 text-stone-300 transition-all hover:border-accent-500/30 hover:text-accent-600 hover:bg-accent-500/5 group mt-9"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg group-hover:scale-110 transition-transform">
                <Plus className="h-5 w-5 text-stone-300 group-hover:text-accent-500" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 text-center px-4">Новая стадия</span>
            </button>
          </div>
        </div>
      ) : (
        <LeadTableView 
          leads={filteredLeads}
          stages={stages}
          tours={tours}
          onLeadClick={handleLeadClick}
        />
      )}

      {/* Lead Details Modal */}
      <AdminModal
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title={selectedLead?.name || "Заявка"}
        description={`Запрос от ${new Date(selectedLead?.created_at || "").toLocaleString("ru-RU")}`}
        footer={
          <div className="flex w-full justify-between items-center">
             <a 
              href={`tel:${selectedLead?.phone}`} 
              className="admin-button-secondary border-stone-200"
            >
              <Phone className="h-4 w-4" />
              Позвонить
            </a>
            <div className="flex gap-3">
              <button onClick={() => setSelectedLead(null)} className="admin-button-secondary">
                Отмена
              </button>
              <button onClick={() => void saveLeadDetails()} disabled={editSaving} className="admin-button-primary">
                <Save className="h-4 w-4" />
                {editSaving ? "Сохранение..." : "Сохранить заметку"}
              </button>
            </div>
          </div>
        }
      >
        <div className="grid gap-8">
          <div className="grid gap-4 sm:grid-cols-2 text-stone-900">
            <div className="admin-subtle-panel p-5">
              <div className="admin-kicker mb-3">Телефон</div>
              <p className="text-xl font-serif font-extrabold">{selectedLead?.phone}</p>
            </div>
            <div className="admin-subtle-panel p-5">
              <div className="admin-kicker mb-3">Заявка на тур</div>
              <p className="text-sm font-bold flex items-center gap-2">
                {selectedLead?.tour_id 
                  ? tours.find(t => t.id === selectedLead.tour_id)?.title || `ID: ${selectedLead.tour_id}`
                  : "Общая заявка"}
              </p>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-stone-500">
                <ExternalLink className="h-3 w-3" />
                Источник: {getSourceName(selectedLead?.source_page || null, tours.find(t => t.id === selectedLead?.tour_id)?.title)}
              </div>
            </div>
          </div>

          <div className="admin-subtle-panel p-6">
            <div className="admin-kicker mb-3">Сообщение клиента</div>
            <p className="text-stone-700 leading-relaxed italic">
              «{selectedLead?.message?.trim() || "Без сообщения"}»
            </p>
          </div>

          <FormField label="Комментарий менеджера" hint="Виден только в админ-панели">
            <TextArea
              rows={6}
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              placeholder="Введите важные детали переговоров..."
            />
          </FormField>
        </div>
      </AdminModal>

      <StagesSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
          void loadData();
        }}
        initialStages={stages}
      />
    </div>
  );
}

// --- Stages Settings Modal Component ---

function StagesSettingsModal({ 
  isOpen, 
  onClose, 
  initialStages 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  initialStages: LeadStage[];
}) {
  const [stages, setStages] = useState<LeadStage[]>(initialStages);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) setStages(initialStages);
  }, [isOpen, initialStages]);

  const addStage = () => {
    const newStage: LeadStage = {
      id: Date.now(),
      title: "Новая стадия",
      sort_order: stages.length + 1,
      color: "#78716c",
      created_at: new Date().toISOString(),
    };
    setStages([...stages, newStage]);
  };

  const updateStage = (id: number, fields: Partial<LeadStage>) => {
    setStages(prev => prev.map(s => s.id === id ? { ...s, ...fields } : s));
  };

  const deleteStage = async (id: number) => {
    if (stages.length <= 1) {
      alert("Нельзя удалить последнюю стадию.");
      return;
    }
    if (!confirm("Вы уверены? Заявки из этой стадии могут остаться без привязки.")) return;
    
    if (id > 1000000000) {
      setStages(prev => prev.filter(s => s.id !== id));
    } else {
      try {
        await adminApi.deleteLeadStage(id);
        setStages(prev => prev.filter(s => s.id !== id));
      } catch (err) {
        alert("Ошибка удаления на сервере");
      }
    }
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      for (const stage of stages) {
        const payload = {
          title: stage.title,
          sort_order: stage.sort_order,
          color: stage.color,
        };
        if (stage.id > 1000000000) {
          await adminApi.createLeadStage(payload);
        } else {
          await adminApi.updateLeadStage(stage.id, payload);
        }
      }
      onClose();
    } catch (err) {
      alert("Ошибка при сохранении стадий");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Настройка воронки"
      description="Управляйте этапами продаж. Вы можете менять названия, цвета и порядок колонок."
      maxWidth="3xl"
      footer={
        <div className="flex gap-3">
          <button onClick={onClose} className="admin-button-secondary">Отмена</button>
          <button onClick={() => void saveAll()} disabled={saving} className="admin-button-primary">
            {saving ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex items-center gap-4 rounded-2xl border border-stone-100 bg-stone-50/50 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-200 text-[10px] font-bold text-stone-500">
                {index + 1}
              </div>
              
              <div className="flex-1 flex gap-3">
                <TextInput
                  value={stage.title}
                  onChange={(e) => updateStage(stage.id, { title: e.target.value })}
                  placeholder="Название стадии"
                  className="bg-white"
                />
                <input
                  type="color"
                  value={stage.color}
                  onChange={(e) => updateStage(stage.id, { color: e.target.value })}
                  className="h-11 w-14 shrink-0 cursor-pointer rounded-xl border-none p-1"
                />
              </div>

              <button
                onClick={() => void deleteStage(stage.id)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addStage}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stone-200 py-4 text-sm font-bold text-stone-500 transition-colors hover:border-stone-300 hover:bg-stone-50"
        >
          <Plus className="h-4 w-4" />
          Добавить стадию
        </button>
      </div>
    </AdminModal>
  );
}
