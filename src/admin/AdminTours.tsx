import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
} from "motion/react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  CreditCard,
  Eye,
  ImagePlus,
  Layers,
  Loader2,
  Map,
  MapPin,
  Package2,
  Plus,
  RefreshCcw,
  Save,
  Search,
  Sparkles,
  Trash2,
  Users,
  Wand2,
} from "lucide-react";
import { adminApi, authStorage, uploadToSupabaseStorage } from "../lib/api";
import type { Tour, TourUpsertInput, TourWithProgram, HomeContent } from "../lib/types";
import { slugify } from "../lib/utils";
import {
  AdminPageHeader,
  Badge,
  EmptyState,
  FormField,
  ImageUpload,
  LoadingState,
  Notice,
  Section,
  StatCard,
  TextArea,
  TextInput,
  Toggle,
} from "./components/AdminUI";
import { cn } from "../lib/utils";

interface AdminTourForm extends TourUpsertInput {
  hero_tour_id: number | null;
}

const EMPTY_FORM: AdminTourForm = {
  slug: "",
  title: "",
  short_description: "",
  full_description: "",
  price_from: "",
  duration: "",
  group_size: "",
  location: "",
  cover_image_url: "",
  gallery: [],
  is_published: true,
  sort_order: 0,
  seo_title: "",
  seo_description: "",
  hero_tour_id: null,
  program_items: [],
};

function mapTourToForm(tour?: TourWithProgram | null, homeContent?: HomeContent | null): AdminTourForm {
  if (!tour) {
    return { ...EMPTY_FORM, gallery: [], program_items: [] };
  }

  return {
    slug: tour.slug ?? "",
    title: tour.title ?? "",
    short_description: tour.short_description ?? "",
    full_description: tour.full_description ?? "",
    price_from: tour.price_from ?? "",
    duration: tour.duration ?? "",
    group_size: tour.group_size ?? "",
    location: tour.location ?? "",
    cover_image_url: tour.cover_image_url ?? "",
    gallery: [...(tour.gallery ?? [])],
    is_published: Boolean(tour.is_published),
    sort_order: Number(tour.sort_order ?? 0),
    seo_title: tour.seo_title ?? "",
    seo_description: tour.seo_description ?? "",
    hero_tour_id: homeContent?.hero_tour_id === tour.id ? tour.id : null,
    program_items: (tour.program_items ?? []).map((item, index) => ({
      title: item.title ?? "",
      description: item.description ?? "",
      image_url: item.image_url ?? "",
      position: Number.isFinite(item.position) ? item.position : index,
    })),
  };
}

function normalizeForm(form: AdminTourForm): AdminTourForm {
  return {
    ...form,
    slug: form.slug.trim(),
    title: form.title.trim(),
    short_description: form.short_description.trim(),
    full_description: form.full_description.trim(),
    price_from: form.price_from.trim(),
    duration: form.duration.trim(),
    group_size: form.group_size.trim(),
    location: form.location.trim(),
    cover_image_url: form.cover_image_url.trim(),
    gallery: form.gallery.map((item) => item.trim()).filter(Boolean),
    seo_title: form.seo_title.trim(),
    seo_description: form.seo_description.trim(),
    program_items: form.program_items
      .map((item, index) => ({
        title: item.title.trim(),
        description: item.description.trim(),
        image_url: item.image_url.trim(),
        position: index,
      }))
      .filter((item) => item.title || item.description || item.image_url),
  };
}

function validateTourForm(form: AdminTourForm) {
  if (!form.title) return "Укажите название тура.";
  if (!form.slug) return "Заполните slug маршрута.";
  if (!form.short_description) return "Добавьте короткое описание для карточки.";
  if (!form.cover_image_url) return "Загрузите обложку тура.";

  const hasIncompleteProgram = form.program_items.some(
    (item) => !item.title || !item.description || !item.image_url,
  );
  if (hasIncompleteProgram) {
    return "Каждый пункт программы должен содержать заголовок, описание и изображение.";
  }

  return "";
}

export default function AdminTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedId, setSelectedId] = useState<number | "new">("new");
  const [form, setForm] = useState<AdminTourForm>(mapTourToForm());
  const [initialForm, setInitialForm] = useState<AdminTourForm>(mapTourToForm());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [bootstrapping, setBootstrapping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [galleryDraft, setGalleryDraft] = useState("");
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [activeTab, setActiveTab] = useState<"main" | "media" | "program" | "seo">("main");
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const selectedTour = useMemo(
    () => tours.find((item) => item.id === selectedId),
    [selectedId, tours],
  );

  const normalizedCurrent = useMemo(() => normalizeForm(form), [form]);
  const normalizedInitial = useMemo(() => normalizeForm(initialForm), [initialForm]);
  const isDirty = JSON.stringify(normalizedCurrent) !== JSON.stringify(normalizedInitial);

  async function loadTours() {
    setLoadingList(true);
    setError("");

    try {
      const data = await adminApi.getTours();
      setTours(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить туры.");
      return [];
    } finally {
      setLoadingList(false);
    }
  }

  async function loadHomeContent() {
    try {
      const data = await adminApi.getHome();
      setHomeContent(data);
    } catch (err) {
      console.error("Failed to load home content:", err);
    }
  }

  async function loadTourDetails(id: number) {
    setLoadingDetail(true);
    setError("");

    try {
      const detail = await adminApi.getTour(id);
      const nextForm = mapTourToForm(detail, homeContent);
      setSelectedId(id);
      setForm(nextForm);
      setInitialForm(nextForm);
      setSlugTouched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить детали тура.");
    } finally {
      setLoadingDetail(false);
    }
  }

  function openNewTour() {
    const nextForm = mapTourToForm();
    setSelectedId("new");
    setForm(nextForm);
    setInitialForm(nextForm);
    setSlugTouched(false);
    setGalleryDraft("");
    setStatus("");
    setError("");
  }

  async function selectTour(id: number | "new") {
    if (id === "new") {
      openNewTour();
      return;
    }

    await loadTourDetails(id);
  }

  async function save(event?: { preventDefault: () => void }) {
    event?.preventDefault();

    const payload = normalizeForm(form);
    const validationError = validateTourForm(payload);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");
    setStatus("");

    try {
      // Исключаем hero_tour_id из полезной нагрузки для API туров
      const { hero_tour_id, ...tourPayload } = payload;

      const saved =
        selectedId === "new"
          ? await adminApi.createTour(tourPayload)
          : await adminApi.updateTour(selectedId, tourPayload);

      // Синхронизация Hero-тура
      const isHero = hero_tour_id === Number(selectedId === "new" ? saved.id : selectedId);
      if (homeContent) {
        const wasHero = homeContent.hero_tour_id === saved.id;
        if (isHero !== wasHero) {
          await adminApi.updateHome({
            ...homeContent,
            hero_tour_id: isHero ? saved.id : null,
          });
          await loadHomeContent();
        }
      }

      await loadTours();
      await loadTourDetails(saved.id);
      setStatus(selectedId === "new" ? "Маршрут создан." : "Маршрут сохранён.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить тур.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (selectedId === "new") return;
    
    const confirmDelete = window.confirm(
      `Вы уверены, что хотите навсегда удалить маршрут "${selectedTour?.title}"?\nЭто действие нельзя отменить.`
    );
    
    if (!confirmDelete) return;

    setDeleting(true);
    setError("");

    try {
      await adminApi.deleteTour(selectedId);
      
      // Сброс состояния после удаления
      const nextTours = await loadTours();
      if (nextTours.length > 0) {
        await selectTour(nextTours[0].id);
      } else {
        openNewTour();
      }
      
      setStatus("Маршрут успешно удалён.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось удалить тур.");
    } finally {
      setDeleting(false);
    }
  }

  async function bootstrapTours() {
    setBootstrapping(true);
    setError("");
    setStatus("");

    try {
      await adminApi.bootstrapDefaultContent();
      await loadTours();
      setStatus("Базовый набор контента загружен.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось импортировать текущий контент.");
    } finally {
      setBootstrapping(false);
    }
  }

  function updateField<K extends keyof TourUpsertInput>(key: K, value: TourUpsertInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugTouched ? prev.slug : slugify(value),
      seo_title: prev.seo_title || value,
    }));
  }

  function regenerateSlug() {
    const nextSlug = slugify(form.title);
    updateField("slug", nextSlug);
    setSlugTouched(true);
  }

  function addProgramItem() {
    setForm((prev) => ({
      ...prev,
      program_items: [
        ...prev.program_items,
        {
          title: "",
          description: "",
          image_url: "",
          position: prev.program_items.length,
        },
      ],
    }));
  }

  function updateProgramItem(
    index: number,
    patch: Partial<TourUpsertInput["program_items"][number]>,
  ) {
    setForm((prev) => {
      const nextItems = [...prev.program_items];
      nextItems[index] = { ...nextItems[index], ...patch };
      return { ...prev, program_items: nextItems };
    });
  }

  function removeProgramItem(index: number) {
    setForm((prev) => ({
      ...prev,
      program_items: prev.program_items.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function moveProgramItem(index: number, direction: "up" | "down") {
    setForm((prev) => {
      const nextItems = [...prev.program_items];
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= nextItems.length) {
        return prev;
      }

      [nextItems[index], nextItems[targetIndex]] = [nextItems[targetIndex], nextItems[index]];
      return { ...prev, program_items: nextItems };
    });
  }

  function addGalleryItem(url = galleryDraft.trim()) {
    if (!url) return;

    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.includes(url) ? prev.gallery : [...prev.gallery, url],
    }));
    setGalleryDraft("");
  }

  async function uploadGalleryImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const token = authStorage.getToken();
    if (!token) {
      setError("Не найден токен авторизации.");
      event.target.value = "";
      return;
    }

    setGalleryUploading(true);
    setError("");

    try {
      const url = await uploadToSupabaseStorage(file, token);
      addGalleryItem(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить изображение в галерею.");
    } finally {
      setGalleryUploading(false);
      event.target.value = "";
    }
  }

  useEffect(() => {
    void loadTours();
    void loadHomeContent();
  }, []);

  const filteredTours = useMemo(
    () =>
      tours.filter((tour) => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;
        return (
          tour.title.toLowerCase().includes(query) ||
          tour.slug.toLowerCase().includes(query) ||
          tour.location.toLowerCase().includes(query)
        );
      }),
    [searchQuery, tours],
  );

  const publishedCount = tours.filter((tour) => tour.is_published).length;
  const draftCount = tours.length - publishedCount;

  return (
    <div className="space-y-12">
      <AdminPageHeader
        eyebrow="Управление контентом"
        title="Туры и маршруты"
        description="Создавайте и редактируйте программы путешествий. Все изменения сохраняются в реальном времени."
        actions={
          <div className="flex gap-3">
            <button type="button" onClick={openNewTour} className="admin-button-secondary">
              <Plus className="h-4 w-4" />
              Создать новый
            </button>
            {selectedId !== "new" && (
              <button 
                type="button" 
                onClick={() => void handleDelete()} 
                disabled={deleting || loadingDetail} 
                className="admin-button-secondary border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Удалить
              </button>
            )}
            <button type="button" onClick={() => void save()} disabled={saving || loadingDetail} className="admin-button-primary min-w-[140px]">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Сохранение" : "Сохранить тур"}
            </button>
          </div>
        }
      />

      {error ? <Notice tone="danger" className="animate-in fade-in slide-in-from-top-4">{error}</Notice> : null}
      {status ? <Notice tone="success" className="animate-in fade-in slide-in-from-top-4">{status}</Notice> : null}

      <div className="grid gap-12 xl:grid-cols-[320px_1fr]">
        <aside className="space-y-8">
          <div className="space-y-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <TextInput
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Найти направление..."
                className="pl-11"
              />
            </div>
            
            <div className="flex items-center justify-between px-1">
              <div className="admin-kicker">Всего маршрутов: {tours.length}</div>
              <div className="flex gap-2">
                <Badge tone="success">{publishedCount}</Badge>
                <Badge tone="default">{draftCount}</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {loadingList ? (
              <div className="space-y-3 py-10 text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-stone-300" />
                <p className="text-xs text-stone-400">Загрузка списка...</p>
              </div>
            ) : filteredTours.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-stone-200 p-8 text-center">
                <p className="text-sm text-stone-500">Ничего не найдено</p>
              </div>
            ) : (
              filteredTours.map((tour) => (
                <button
                  key={tour.id}
                  type="button"
                  onClick={() => void selectTour(tour.id)}
                  className={cn(
                    "group flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition-all duration-300",
                    selectedId === tour.id
                      ? "border-accent-500/30 bg-accent-500/10 shadow-sm"
                      : "border-transparent bg-white/50 hover:bg-stone-100/80 hover:text-stone-900",
                  )
                }
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                    {tour.cover_image_url ? (
                      <img src={tour.cover_image_url} alt="" className="h-full w-full object-cover grayscale transition-all group-hover:grayscale-0" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-stone-200">
                        {/* Fallback pattern */}
                        <div className="h-full w-full bg-stone-200 opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold tracking-tight text-stone-900">{tour.title}</div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <div className={cn("h-1.5 w-1.5 rounded-full", tour.is_published ? "bg-emerald-500" : "bg-stone-300")} />
                      <span className="text-[10px] uppercase tracking-wider text-stone-500">
                        {tour.is_published ? "Опубликован" : "Черновик"}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <div className="space-y-10">
          {loadingDetail ? (
            <LoadingState
              title="Загрузка деталей"
              description="Мы подтягиваем программу и медиа выбранного маршрута."
            />
          ) : (
            <form onSubmit={(event) => void save(event)} className="space-y-10 pb-20">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="font-serif text-4xl font-extrabold leading-none tracking-tight text-stone-900">
                      {selectedId === "new" ? "Создание маршрута" : form.title || "Без названия"}
                    </h2>
                    {isDirty && <Badge tone="accent" className="animate-pulse">Черновик не сохранен</Badge>}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-stone-900">{form.slug || "..."}</span>
                      <span className="text-xs opacity-50 uppercase tracking-widest">(slug)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Toggle
                    label="Публикация"
                    checked={form.is_published}
                    onChange={(val) => setForm({ ...form, is_published: val })}
                  />
                  <Toggle
                    label="В топе"
                    checked={form.hero_tour_id !== null}
                    onChange={(val) =>
                      setForm({
                        ...form,
                        hero_tour_id: val ? Number(selectedId) : null,
                      })
                    }
                  />
                </div>
              </div>

              <div className="sticky top-0 z-20 flex gap-1 border-b border-stone-100 bg-white/80 py-2 backdrop-blur-md">
                {[
                  { key: "main", label: "Основные данные", icon: Package2 },
                  { key: "media", label: "Галерея и медиа", icon: ImagePlus },
                  { key: "program", label: "Описание программы", icon: Layers },
                  { key: "seo", label: "Поисковая оптимизация", icon: Wand2 },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key as typeof activeTab)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-bold transition-all",
                      activeTab === key
                        ? "bg-accent-500 text-white shadow-lg shadow-accent-500/20"
                        : "text-stone-400 hover:bg-stone-50 hover:text-stone-700",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className={cn(activeTab === key ? "block" : "hidden md:block")}>{label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-12">
                {activeTab === "main" && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                    <div className="grid gap-8 md:grid-cols-2">
                      <FormField label="Заголовок маршрута">
                        <TextInput
                          value={form.title}
                          onChange={(event) => handleTitleChange(event.target.value)}
                        />
                      </FormField>

                      <FormField label="URL-адрес (Slug)">
                        <div className="flex gap-2">
                          <TextInput
                            value={form.slug}
                            onChange={(event) => {
                              setSlugTouched(true);
                              updateField("slug", slugify(event.target.value));
                            }}
                          />
                        </div>
                      </FormField>
                    </div>

                    <div className="grid gap-8 md:grid-cols-4">
                      <FormField label="Цена от">
                        <TextInput
                          value={form.price_from}
                          onChange={(event) => updateField("price_from", event.target.value)}
                        />
                      </FormField>
                      <FormField label="Длительность">
                        <TextInput
                          value={form.duration}
                          onChange={(event) => updateField("duration", event.target.value)}
                        />
                      </FormField>
                      <FormField label="Группа">
                        <TextInput
                          value={form.group_size}
                          onChange={(event) => updateField("group_size", event.target.value)}
                        />
                      </FormField>
                      <FormField label="Локация">
                        <TextInput
                          value={form.location}
                          onChange={(event) => updateField("location", event.target.value)}
                        />
                      </FormField>
                    </div>

                    <FormField label="Краткое описание">
                      <TextArea
                        rows={3}
                        value={form.short_description}
                        onChange={(event) => updateField("short_description", event.target.value)}
                      />
                    </FormField>

                    <FormField label="Полное описание тура">
                      <TextArea
                        rows={10}
                        value={form.full_description}
                        onChange={(event) => updateField("full_description", event.target.value)}
                      />
                    </FormField>
                  </div>
                )}

                {activeTab === "media" && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
                    <Section title="Визуальный контент">
                      <div className="grid gap-10 xl:grid-cols-[1fr_1.5fr]">
                        <FormField label="Главная обложка">
                          <ImageUpload
                            value={form.cover_image_url}
                            onChange={(url) => updateField("cover_image_url", url)}
                            label="Основное фото"
                          />
                        </FormField>

                        <div className="space-y-6">
                          <div className="grid gap-4 sm:grid-cols-3">
                            {form.gallery.map((image, index) => (
                              <div key={index} className="group relative aspect-square overflow-hidden rounded-2xl bg-stone-100">
                                <img src={image} alt="" className="h-full w-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => updateField("gallery", form.gallery.filter((_, i) => i !== index))}
                                  className="absolute inset-0 flex items-center justify-center bg-red-600/80 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                  <Trash2 className="h-6 w-6" />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => galleryInputRef.current?.click()}
                              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stone-200"
                            >
                              <Plus className="h-6 w-6" />
                            </button>
                          </div>
                          <input type="file" ref={galleryInputRef} onChange={uploadGalleryImage} accept="image/*" className="hidden" />
                        </div>
                      </div>
                    </Section>
                  </div>
                )}

                {activeTab === "program" && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-2xl font-extrabold text-stone-900">Программа по дням</h3>
                      <button type="button" onClick={addProgramItem} className="admin-button-secondary">
                        <Plus className="h-4 w-4" />
                        Добавить день
                      </button>
                    </div>

                    <div className="grid gap-6">
                      {form.program_items.map((item, index) => (
                        <div key={index} className="group relative rounded-[2rem] border border-stone-100 bg-white p-6 md:p-8">
                          <div className="absolute -left-3 top-8 flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-900 text-sm font-bold text-white shadow-xl">
                            {index + 1}
                          </div>
                          <div className="grid gap-8 md:grid-cols-[200px_1fr]">
                            <ImageUpload
                              value={item.image_url}
                              onChange={(url) => updateProgramItem(index, { image_url: url })}
                              label="Фото локации"
                            />
                            <div className="space-y-4">
                              <div className="flex items-center justify-between gap-4">
                                <TextInput
                                  value={item.title}
                                  onChange={(event) => updateProgramItem(index, { title: event.target.value })}
                                  placeholder="Название дня"
                                  className="border-none bg-stone-50 px-0 text-xl font-bold"
                                />
                                <div className="flex gap-1">
                                  <button type="button" onClick={() => removeProgramItem(index)} className="p-2 text-red-300 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                                </div>
                              </div>
                              <TextArea
                                value={item.description}
                                onChange={(event) => updateProgramItem(index, { description: event.target.value })}
                                placeholder="Описание дня"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "seo" && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                    <Section title="SEO настройки">
                      <div className="grid gap-8">
                        <FormField label="Meta Title">
                          <TextInput
                            value={form.seo_title}
                            onChange={(event) => updateField("seo_title", event.target.value)}
                          />
                        </FormField>
                        <FormField label="Meta Description">
                          <TextArea
                            rows={4}
                            value={form.seo_description}
                            onChange={(event) => updateField("seo_description", event.target.value)}
                          />
                        </FormField>
                        <FormField label="Порядковый номер">
                          <TextInput
                            type="number"
                            value={String(form.sort_order)}
                            onChange={(event) => updateField("sort_order", Number(event.target.value) || 0)}
                          />
                        </FormField>
                      </div>
                    </Section>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
