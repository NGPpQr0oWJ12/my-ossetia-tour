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
} from "lucide-react";
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

// --- Components ---

function KanbanCard({ lead, onClick, ...props }: { lead: Lead; onClick: () => void; [key: string]: any }) {
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
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="relative h-[120px] rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/50"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-all hover:border-accent-500/30 hover:shadow-md cursor-default"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-serif text-lg font-bold text-stone-900 line-clamp-1">{lead.name}</h4>
        <div 
          {...attributes} 
          {...listeners}
          className="p-1 text-stone-300 hover:text-stone-500 cursor-grab active:cursor-grabbing transition-colors"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Phone className="h-3 w-3" />
          <span>{lead.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-stone-400 uppercase tracking-wider">
          <CalendarClock className="h-3 w-3" />
          <span>{new Date(lead.created_at).toLocaleDateString("ru-RU")}</span>
        </div>
      </div>

      {lead.manager_comment && (
        <div className="mt-1 flex items-start gap-2 rounded-lg bg-stone-50 p-2 text-[11px] text-stone-600 line-clamp-2">
          <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />
          <span>{lead.manager_comment}</span>
        </div>
      )}
      
      <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="h-4 w-4 text-accent-500" />
      </div>
    </div>
  );
}

function KanbanColumn({ 
  stage, 
  leads, 
  onLeadClick,
  ...props
}: { 
  stage: LeadStage; 
  leads: Lead[]; 
  onLeadClick: (lead: Lead) => void;
  [key: string]: any;
}) {
  const {
    setNodeRef,
  } = useSortable({
    id: `column-${stage.id}`,
    data: {
      type: "Column",
      stage,
    },
  });

  return (
    <div className="flex h-full w-80 shrink-0 flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div 
            className="h-2 w-2 rounded-full ring-4 ring-white shadow-sm" 
            style={{ backgroundColor: stage.color }} 
          />
          <h3 className="font-serif text-xl font-extrabold text-stone-900">{stage.title}</h3>
          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-500">
            {leads.length}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="flex min-h-[500px] flex-1 flex-col gap-3 rounded-[2rem] bg-stone-100/50 p-3 transition-colors"
      >
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <KanbanCard key={lead.id} lead={lead} onClick={() => onLeadClick(lead)} />
          ))}
        </SortableContext>
        
        {leads.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="mb-2 h-10 w-10 rounded-full bg-white flex items-center justify-center text-stone-300">
              <Plus className="h-5 w-5" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
              Пусто
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main Component ---

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stages, setStages] = useState<LeadStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  
  // Selection
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeId, setActiveId] = useState<number | string | null>(null);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  // Edit states
  const [editComment, setEditComment] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function loadData() {
    setLoading(true);
    try {
      const [leadsData, stagesData] = await Promise.all([
        adminApi.getLeads(),
        adminApi.getLeadStages(),
      ]);
      setLeads(leadsData);
      setStages(stagesData);
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

    // Find if over is a column
    const overData = over.data.current;
    if (overData?.type === "Column") {
      const stageId = overData.stage.id;
      setLeads(prev => {
        const activeLead = prev.find(l => l.id === activeId);
        if (activeLead && activeLead.stage_id !== stageId) {
          return prev.map(l => l.id === activeId ? { ...l, stage_id: stageId } : l);
        }
        return prev;
      });
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveLead(null);

    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id;

    // If over a card, find its stage
    const overData = over.data.current;
    let targetStageId: number | null = null;
    
    if (overData?.type === "Column") {
      targetStageId = overData.stage.id;
    } else if (overData?.type === "Lead") {
      targetStageId = (overData.lead as Lead).stage_id;
    }

    if (targetStageId !== null) {
      const lead = leads.find(l => l.id === activeId);
      if (lead && lead.stage_id !== targetStageId) {
        try {
          await adminApi.updateLead(activeId, { stage_id: targetStageId });
          setStatus("Статус заявки обновлен");
          setTimeout(() => setStatus(""), 3000);
        } catch (err) {
          setError("Не удалось сохранить статус на сервере");
          // Rollback
          void loadData();
        }
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

  if (loading) {
    return <LoadingState title="Загрузка CRM" description="Синхронизируем воронку продаж..." />;
  }

  return (
    <div className="h-full flex flex-col gap-8">
      <AdminPageHeader
        eyebrow="CRM"
        title="Воронка заявок"
        description="Управляйте клиентами с помощью канбан-доски. Перетаскивайте карточки для смены этапа."
        actions={
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSettingsOpen(true)} className="admin-button-secondary">
              <Settings2 className="h-4 w-4" />
              Настроить стадии
            </button>
            <button onClick={() => void loadData()} className="admin-button-secondary bg-white">
              <RefreshCcw className="h-4 w-4" />
              Обновить
            </button>
          </div>
        }
      />

      {error ? <Notice tone="danger" className="mx-8">{error}</Notice> : null}
      {status ? <Notice tone="success" className="mx-8">{status}</Notice> : null}

      <div className="flex-1 overflow-x-auto pb-8">
        <div className="flex gap-6 h-full min-h-[600px] px-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
          >
            {stages.map((stage) => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                leads={leads.filter((l) => l.stage_id === stage.id)}
                onLeadClick={handleLeadClick}
              />
            ))}

            <DragOverlay dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: {
                  active: {
                    opacity: '0.5',
                  },
                },
              }),
            }}>
              {activeLead ? (
                <div className="flex flex-col gap-3 rounded-2xl border border-accent-500/50 bg-white p-4 shadow-xl rotate-3 scale-105 cursor-grabbing w-80">
                   <div className="flex items-start justify-between gap-2">
                    <h4 className="font-serif text-lg font-bold text-stone-900">{activeLead.name}</h4>
                    <GripVertical className="h-4 w-4 text-accent-500" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <Phone className="h-3 w-3" />
                    <span>{activeLead.phone}</span>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          {/* Add Column Button */}
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex h-full w-80 shrink-0 flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed border-stone-200 bg-stone-50/30 text-stone-400 transition-all hover:border-stone-300 hover:text-stone-600 hover:bg-stone-50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
              <Plus className="h-6 w-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Новая стадия</span>
          </button>
        </div>
      </div>

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
              <div className="admin-kicker mb-3">Источник</div>
              <p className="text-sm font-bold flex items-center gap-2">
                {selectedLead?.source_page}
                <ExternalLink className="h-3 w-3 text-stone-400" />
              </p>
              {selectedLead?.tour_id && (
                <p className="mt-1 text-xs text-stone-500">
                  Интересует тур ID #{selectedLead.tour_id}
                </p>
              )}
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

      {/* Stages Settings Modal */}
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
      id: Date.now(), // Temp ID
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
    
    // If it's a real stage (not temp), call API
    if (id > 1000000000) { // Simple check for temp ID (Date.now())
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
