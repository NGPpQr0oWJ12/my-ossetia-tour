import React, { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ImagePlus,
  Layers,
  Loader2,
  Map,
  Package2,
  Plus,
  Save,
  Search,
  Trash2,
  Wand2,
} from "lucide-react";
import { adminApi, authStorage, uploadToSupabaseStorage } from "../lib/api";
import type { Tour, TourUpsertInput, TourWithProgram, HomeContent } from "../lib/types";
import { slugify, cn } from "../lib/utils";
import {
  AdminPageHeader,
  Badge,
  EmptyState,
  FormField,
  ImageUpload,
  LoadingState,
  Notice,
  Section,
  Select,
  TextArea,
  TextInput,
  Toggle,
} from "./components/AdminUI";

/**
 * Интерфейс формы, расширяющий входные данные тура полем для управления Hero-туром.
 */
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
  difficulty: "Легкая",
  season: "Круглый год",
  seo_title: "",
  seo_description: "",
  hero_tour_id: null,
  program_items: [],
};

/**
 * Маппинг данных тура из API в формат формы.
 */
function mapTourToForm(tour?: TourWithProgram | null, homeContent?: HomeContent | null): AdminTourForm {
  if (!tour) {
    return { ...EMPTY_FORM, gallery: [], program_items: [] };
  }

  return {
    slug: tour.slug || "",
    title: tour.title || "",
    short_description: tour.short_description || "",
    full_description: tour.full_description || "",
    price_from: tour.price_from || "",
    duration: tour.duration || "",
    group_size: tour.group_size || "",
    location: tour.location || "",
    cover_image_url: tour.cover_image_url || "",
    gallery: Array.isArray(tour.gallery) ? [...tour.gallery] : [],
    difficulty: tour.difficulty || "Легкая",
    season: tour.season || "Круглый год",
    is_published: Boolean(tour.is_published),
    sort_order: typeof tour.sort_order === "number" ? tour.sort_order : 0,
    seo_title: tour.seo_title || "",
    seo_description: tour.seo_description || "",
    hero_tour_id: homeContent?.hero_tour_id === tour.id ? tour.id : null,
    program_items: (tour.program_items || []).map((item, idx) => ({
      title: item.title || "",
      description: item.description || "",
      image_url: item.image_url || "",
      position: typeof item.position === "number" ? item.position : idx,
    })),
  };
}

/**
 * Очистка и нормализация данных перед сохранением.
 */
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
    gallery: form.gallery.map(url => url.trim()).filter(Boolean),
    difficulty: form.difficulty,
    season: form.season,
    seo_title: form.seo_title.trim(),
    seo_description: form.seo_description.trim(),
    program_items: form.program_items
      .map((item, idx) => ({
        title: item.title.trim(),
        description: item.description.trim(),
        image_url: item.image_url.trim(),
        position: idx,
      }))
      .filter(item => item.title || item.description || item.image_url),
  };
}

/**
 * Валидация обязательных полей.
 */
function validateTourForm(form: AdminTourForm): string {
  if (!form.title) return "Укажите название тура.";
  if (!form.slug) return "Slug маршрута обязателен для навигации.";
  if (!form.short_description) return "Добавьте краткое описание.";
  if (!form.cover_image_url) return "Загрузите основное фото (обложку).";

  const hasIncompleteItems = form.program_items.some(
    item => !item.title || !item.description || !item.image_url
  );
  if (hasIncompleteItems) {
    return "Заполните все поля (заголовок, описание, фото) для каждого дня программы.";
  }

  return "";
}

export default function AdminTours() {
  // Состояния данных
  const [tours, setTours] = useState<Tour[]>([]);
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [selectedId, setSelectedId] = useState<number | "new" | null>(null);
  
  // Состояния формы
  const [form, setForm] = useState<AdminTourForm>(EMPTY_FORM);
  const [initialForm, setInitialForm] = useState<AdminTourForm>(EMPTY_FORM);
  const [activeTab, setActiveTab] = useState<"main" | "media" | "program" | "seo">("main");
  const [searchQuery, setSearchQuery] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  
  // Статусы процессов
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [galleryUploading, setGalleryUploading] = useState(false);

  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Вычисляемые свойства
  const selectedTour = useMemo(() => tours.find(t => t.id === selectedId), [selectedId, tours]);
  const isDirty = useMemo(() => {
    return JSON.stringify(normalizeForm(form)) !== JSON.stringify(normalizeForm(initialForm));
  }, [form, initialForm]);

  const filteredTours = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return tours;
    return tours.filter(t => 
      t.title.toLowerCase().includes(query) || 
      t.slug.toLowerCase().includes(query)
    );
  }, [searchQuery, tours]);

  // Загрузка данных
  async function loadData() {
    setLoadingList(true);
    try {
      const [toursData, homeData] = await Promise.all([
        adminApi.getTours(),
        adminApi.getHome()
      ]);
      setTours(toursData);
      setHomeContent(homeData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки данных");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  // Действия
  async function selectTour(id: number | "new") {
    if (id === "new") {
      const next = mapTourToForm();
      setSelectedId("new");
      setForm(next);
      setInitialForm(next);
      setSlugTouched(false);
      return;
    }

    setLoadingDetail(true);
    setError("");
    try {
      const detail = await adminApi.getTour(id);
      const next = mapTourToForm(detail, homeContent);
      setSelectedId(id);
      setForm(next);
      setInitialForm(next);
      setSlugTouched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить тур");
    } finally {
      setLoadingDetail(false);
    }
  }

  async function handleDelete() {
    if (!selectedId || selectedId === "new") return;
    if (!window.confirm(`Удалить маршрут "${selectedTour?.title}"?`)) return;

    setDeleting(true);
    try {
      await adminApi.deleteTour(selectedId);
      setStatus("Маршрут удален");
      await loadData();
      setSelectedId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при удалении");
    } finally {
      setDeleting(false);
    }
  }

  async function handleSave(e?: React.FormEvent) {
    e?.preventDefault();
    const payload = normalizeForm(form);
    const vError = validateTourForm(payload);
    if (vError) {
      setError(vError);
      return;
    }

    setSaving(true);
    setError("");
    setStatus("");

    try {
      const { hero_tour_id, ...tourInput } = payload;
      const saved = selectedId === "new" 
        ? await adminApi.createTour(tourInput)
        : await adminApi.updateTour(selectedId as number, tourInput);

      // Hero Tour Sync
      if (homeContent) {
        const isCurrentlyHero = homeContent.hero_tour_id === saved.id;
        const wantToBeHero = hero_tour_id !== null;
        if (isCurrentlyHero !== wantToBeHero) {
          await adminApi.updateHome({
            ...homeContent,
            hero_tour_id: wantToBeHero ? saved.id : null
          });
        }
      }

      await loadData();
      await selectTour(saved.id);
      setStatus("Изменения сохранены");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  // Хелперы формы
  function updateField<K extends keyof TourUpsertInput>(key: K, value: TourUpsertInput[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(val: string) {
    setForm(prev => ({
      ...prev,
      title: val,
      slug: slugTouched ? prev.slug : slugify(val),
      seo_title: prev.seo_title || val
    }));
  }

  async function handleGalleryUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = authStorage.getToken();
    if (!token) {
      setError("Авторизация не найдена");
      return;
    }

    setGalleryUploading(true);
    try {
      const url = await uploadToSupabaseStorage(file, token);
      setForm(prev => ({
        ...prev,
        gallery: prev.gallery.includes(url) ? prev.gallery : [...prev.gallery, url]
      }));
    } catch (err) {
      setError("Ошибка загрузки фото");
    } finally {
      setGalleryUploading(false);
      if (e.target) e.target.value = "";
    }
  }

  function updateProgramItem(idx: number, patch: Partial<TourUpsertInput["program_items"][0]>) {
    setForm(prev => {
      const items = [...prev.program_items];
      items[idx] = { ...items[idx], ...patch };
      return { ...prev, program_items: items };
    });
  }

  return (
    <div className="space-y-12">
      <AdminPageHeader
        eyebrow="Управление контентом"
        title="Туры и маршруты"
        actions={
          <div className="flex gap-3">
            <button type="button" onClick={() => void selectTour("new")} className="admin-button-secondary">
              <Plus className="h-4 w-4" />
              Новый тур
            </button>
            {selectedId && selectedId !== "new" && (
              <button type="button" onClick={() => void handleDelete()} disabled={deleting} className="admin-button-secondary text-red-500 hover:bg-red-50">
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Удалить
              </button>
            )}
            <button type="button" onClick={() => void handleSave()} disabled={saving || !selectedId} className="admin-button-primary">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Сохранить
            </button>
          </div>
        }
      />

      {error && <Notice tone="danger">{error}</Notice>}
      {status && <Notice tone="success">{status}</Notice>}

      <div className="grid gap-12 xl:grid-cols-[300px_1fr]">
        <aside className="space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <TextInput value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Поиск..." className="pl-11" />
          </div>

          <div className="flex flex-col gap-2">
            {loadingList ? (
              <div className="py-10 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-stone-200" /></div>
            ) : filteredTours.map(t => (
              <button
                key={t.id}
                onClick={() => void selectTour(t.id)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition-all",
                  selectedId === t.id ? "border-accent-500/30 bg-accent-500/5 shadow-sm" : "border-transparent hover:bg-stone-50"
                )}
              >
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                  {t.cover_image_url && <img src={t.cover_image_url} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-stone-900">{t.title}</div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-400">{t.is_published ? "Опубликован" : "Черновик"}</div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <div className="min-h-[400px]">
          {!selectedId && !loadingDetail ? (
            <EmptyState icon={Map} title="Выберите маршрут" description="Или создайте новый тур для начала редактирования." />
          ) : loadingDetail ? (
            <LoadingState />
          ) : (
            <form onSubmit={e => void handleSave(e)} className="space-y-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-serif text-4xl font-extrabold text-stone-900">{selectedId === "new" ? "Новый тур" : form.title}</h2>
                    {isDirty && <Badge tone="accent">Черновик</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-stone-400">{form.slug || "ссылка будет создана автоматически"}</p>
                </div>
                <div className="flex gap-4">
                  <Toggle label="Опубликован" checked={form.is_published} onChange={val => updateField("is_published", val)} />
                  <Toggle label="В топе" checked={form.hero_tour_id !== null} onChange={val => setForm(prev => ({ ...prev, hero_tour_id: val ? Number(selectedId === "new" ? 0 : selectedId) : null }))} />
                </div>
              </div>

              <div className="flex gap-2 border-b border-stone-100 pb-2">
                {[
                  { id: "main", label: "Основные", icon: Package2 },
                  { id: "media", label: "Медиа", icon: ImagePlus },
                  { id: "program", label: "Программа", icon: Layers },
                  { id: "seo", label: "SEO", icon: Wand2 }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all",
                      activeTab === tab.id ? "bg-stone-900 text-white" : "text-stone-400 hover:bg-stone-50"
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="space-y-8">
                {activeTab === "main" && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField label="Название"><TextInput value={form.title} onChange={e => handleTitleChange(e.target.value)} /></FormField>
                    <FormField label="Slug"><TextInput value={form.slug} onChange={e => { setSlugTouched(true); updateField("slug", slugify(e.target.value)); }} /></FormField>
                    <FormField label="Цена от"><TextInput value={form.price_from} onChange={e => updateField("price_from", e.target.value)} /></FormField>
                    <FormField label="Длительность"><TextInput value={form.duration} onChange={e => updateField("duration", e.target.value)} /></FormField>
                    <FormField label="Группа"><TextInput value={form.group_size} onChange={e => updateField("group_size", e.target.value)} /></FormField>
                    <FormField label="Локация"><TextInput value={form.location} onChange={e => updateField("location", e.target.value)} /></FormField>
                    <FormField label="Сложность">
                      <Select
                        value={form.difficulty}
                        onChange={e => updateField("difficulty", e.target.value)}
                        options={[
                          { value: "Легкая", label: "Легкая" },
                          { value: "Средняя", label: "Средняя" },
                          { value: "Сложная", label: "Сложная" }
                        ]}
                      />
                    </FormField>
                    <FormField label="Сезон">
                      <Select
                        value={form.season}
                        onChange={e => updateField("season", e.target.value)}
                        options={[
                          { value: "Круглый год", label: "Круглый год" },
                          { value: "Весна", label: "Весна" },
                          { value: "Лето", label: "Лето" },
                          { value: "Осень", label: "Осень" },
                          { value: "Зима", label: "Зима" }
                        ]}
                      />
                    </FormField>
                    <div className="md:col-span-2">
                      <FormField label="Краткое описание"><TextInput value={form.short_description} onChange={e => updateField("short_description", e.target.value)} /></FormField>
                    </div>
                    <div className="md:col-span-2">
                      <FormField label="Полное описание"><TextArea rows={6} value={form.full_description} onChange={e => updateField("full_description", e.target.value)} /></FormField>
                    </div>
                  </div>
                )}

                {activeTab === "media" && (
                  <div className="grid gap-10 lg:grid-cols-2">
                    <FormField label="Обложка">
                      <ImageUpload value={form.cover_image_url} onChange={url => updateField("cover_image_url", url)} label="Главное фото" />
                    </FormField>
                    <div className="space-y-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Галерея</div>
                      <div className="grid grid-cols-3 gap-3">
                        {form.gallery.map((img, i) => (
                          <div key={i} className="group relative aspect-square overflow-hidden rounded-xl bg-stone-100">
                            <img src={img} alt="" className="h-full w-full object-cover" />
                            <button type="button" onClick={() => updateField("gallery", form.gallery.filter((_, idx) => idx !== i))} className="absolute inset-0 flex items-center justify-center bg-red-600/80 text-white opacity-0 group-hover:opacity-100"><Trash2 className="h-5 w-5" /></button>
                          </div>
                        ))}
                        <button type="button" onClick={() => galleryInputRef.current?.click()} className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-stone-200 hover:border-accent-500/40">
                          {galleryUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5 text-stone-300" />}
                        </button>
                      </div>
                      <input type="file" ref={galleryInputRef} onChange={handleGalleryUpload} className="hidden" accept="image/*" />
                    </div>
                  </div>
                )}

                {activeTab === "program" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-xl font-bold">Дни программы</h3>
                      <button type="button" onClick={() => setForm(prev => ({ ...prev, program_items: [...prev.program_items, { title: "", description: "", image_url: "", position: prev.program_items.length }] }))} className="admin-button-secondary">Добавить день</button>
                    </div>
                    <div className="space-y-4">
                      {form.program_items.map((item, i) => (
                        <div key={i} className="flex flex-col gap-6 rounded-3xl border border-stone-100 p-6 md:flex-row">
                          <div className="w-full md:w-48 shrink-0">
                            <ImageUpload value={item.image_url} onChange={url => updateProgramItem(i, { image_url: url })} label={`День ${i + 1}`} aspectClassName="aspect-square" />
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between">
                              <TextInput value={item.title} onChange={e => updateProgramItem(i, { title: e.target.value })} placeholder="Заголовок дня" className="flex-1 border-none bg-stone-50 font-bold" />
                              <button type="button" onClick={() => setForm(p => ({ ...p, program_items: p.program_items.filter((_, idx) => idx !== i) }))} className="ml-2 text-stone-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                            </div>
                            <TextArea value={item.description} onChange={e => updateProgramItem(i, { description: e.target.value })} placeholder="Описание активностей" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "seo" && (
                  <div className="grid gap-6">
                    <FormField label="SEO Title"><TextInput value={form.seo_title} onChange={e => updateField("seo_title", e.target.value)} /></FormField>
                    <FormField label="SEO Description"><TextArea rows={4} value={form.seo_description} onChange={e => updateField("seo_description", e.target.value)} /></FormField>
                    <FormField label="Сортировка"><TextInput type="number" value={String(form.sort_order)} onChange={e => updateField("sort_order", Number(e.target.value) || 0)} /></FormField>
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
