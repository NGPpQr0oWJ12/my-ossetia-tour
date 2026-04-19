import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
} from "motion/react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  Eye,
  ImagePlus,
  Layers,
  Loader2,
  MapPin,
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

  const editorTitle = selectedId === "new" ? "Новый маршрут" : form.title || "Редактирование маршрута";

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Каталог"
        title="Туры"
        description="Редактируйте карточки маршрутов, наполнение страниц и порядок публикации без риска потерять программу поездки."
        actions={
          <div className="flex gap-2">
            <button type="button" onClick={openNewTour} className="admin-button-secondary">
              <Plus className="h-4 w-4" />
              Новый
            </button>
            <button type="button" onClick={() => void save()} disabled={saving || loadingDetail} className="admin-button-primary">
              <Save className="h-4 w-4" />
              {saving ? "..." : "Сохранить"}
            </button>
          </div>
        }
      />

      {error ? <Notice tone="danger">{error}</Notice> : null}
      {status ? <Notice tone="success">{status}</Notice> : null}

      <div className="grid gap-8 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <div className="admin-soft-surface p-5">
            <div className="space-y-4">
              <div>
                <div className="admin-kicker mb-2">Навигация по маршрутам</div>
                <p className="text-sm leading-relaxed text-stone-500">
                  Найдите нужный маршрут по названию, slug или локации и откройте его для редактирования.
                </p>
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <TextInput
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Поиск по турам"
                  className="pl-11"
                />
              </div>
            </div>
          </div>

          <div className="max-h-[calc(100vh-17rem)] space-y-3 overflow-y-auto pr-1">
            {loadingList ? (
              <LoadingState title="Загрузка списка" description="Подтягиваем все маршруты." />
            ) : filteredTours.length === 0 ? (
              <EmptyState
                icon={Search}
                title="Маршруты не найдены"
                description="Попробуйте изменить поисковый запрос или создайте новый тур."
                action={
                  <button type="button" onClick={openNewTour} className="admin-button-secondary">
                    Создать тур
                  </button>
                }
              />
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredTours.map((tour) => (
                  <motion.button
                    key={tour.id}
                    layout
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    type="button"
                    onClick={() => void selectTour(tour.id)}
                    className={cn(
                      "w-full overflow-hidden rounded-[1.5rem] border text-left transition-all duration-300",
                      selectedId === tour.id
                        ? "border-accent-500/30 bg-accent-500/10 shadow-[0_18px_38px_rgba(188,141,89,0.16)]"
                        : "border-stone-200/80 bg-white/90 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-[0_18px_32px_rgba(28,25,23,0.07)]",
                    )}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                      {tour.cover_image_url ? (
                        <img src={tour.cover_image_url} alt={tour.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-stone-400">
                          Нет обложки
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/10 to-transparent" />
                      <div className="absolute left-4 top-4">
                        <Badge tone={tour.is_published ? "success" : "default"}>
                          {tour.is_published ? "Опубликован" : "Черновик"}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-3 p-4">
                      <div className="font-serif text-2xl font-extrabold leading-[1.05] text-stone-900">
                        {tour.title}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tour.duration ? <Badge>{tour.duration}</Badge> : null}
                        {tour.location ? <Badge>{tour.location}</Badge> : null}
                      </div>
                      <div className="text-xs uppercase tracking-[0.22em] text-stone-400">{tour.slug}</div>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            )}
          </div>
        </aside>

        <div className="space-y-8">
          <div className="admin-soft-surface overflow-hidden">
            <div className="grid gap-6 p-5 lg:grid-cols-[1.15fr_0.85fr] lg:p-6">
              <div className="space-y-4">
                <div className="admin-kicker">Текущий редактор</div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-serif text-4xl font-extrabold leading-[0.95] text-stone-900">
                    {editorTitle}
                  </h2>
                  <Badge tone={form.is_published ? "success" : "default"}>
                    {form.is_published ? "Опубликован" : "Черновик"}
                  </Badge>
                  {isDirty ? <Badge tone="accent">Есть несохранённые правки</Badge> : null}
                </div>
                <p className="max-w-2xl text-sm leading-relaxed text-stone-500">
                  {selectedId === "new"
                    ? "Создайте новый маршрут, заполните обязательные поля и добавьте программу поездки."
                    : "Изменения сохраняются вручную. Детали маршрута загружаются отдельно, поэтому программа тура не теряется при редактировании."}
                </p>
                {selectedTour?.updated_at ? (
                  <div className="text-sm text-stone-500">
                    Последнее обновление: {new Date(selectedTour.updated_at).toLocaleString("ru-RU")}
                  </div>
                ) : null}
              </div>

              <div className="admin-subtle-panel grid gap-4 p-4 sm:grid-cols-2">
                <div>
                  <div className="admin-kicker mb-2">Карточка</div>
                  <div className="space-y-2 text-sm text-stone-600">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-accent-600" />
                      {form.price_from || "Цена не указана"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-accent-600" />
                      {form.duration || "Длительность не указана"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-accent-600" />
                      {form.group_size || "Размер группы не указан"}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent-600" />
                      {form.location || "Локация не указана"}
                    </div>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <Toggle
                    label="Опубликовать"
                    description="Тур будет виден всем посетителям."
                    checked={form.is_published}
                    onChange={(val) => setForm({ ...form, is_published: val })}
                  />
                  <Toggle
                    label="Популярный маршрут"
                    description="Отображать этот тур в Hero-блоке на главной."
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
            </div>
          </div>

          {loadingDetail ? (
            <LoadingState
              title="Загрузка маршрута"
              description="Подтягиваем описание, галерею и программу выбранного тура."
            />
          ) : (
            <form onSubmit={(event) => void save(event)} className="space-y-8 pb-20">
              <Section
                title="Основная информация"
                description="Название, тексты и базовые параметры карточки маршрута."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField label="Название тура">
                    <TextInput
                      value={form.title}
                      onChange={(event) => handleTitleChange(event.target.value)}
                      placeholder="Цейское ущелье и Сказский ледник"
                    />
                  </FormField>

                  <FormField label="Slug" hint="Используется в URL">
                    <div className="flex gap-3">
                      <TextInput
                        value={form.slug}
                        onChange={(event) => {
                          setSlugTouched(true);
                          updateField("slug", slugify(event.target.value));
                        }}
                        placeholder="tsey-gorge"
                      />
                      <button type="button" onClick={regenerateSlug} className="admin-button-secondary shrink-0 px-4">
                        <Wand2 className="h-4 w-4" />
                        Сгенерировать
                      </button>
                    </div>
                  </FormField>
                </div>

                <FormField label="Краткое описание" hint="Показывается в карточке тура">
                  <TextArea
                    rows={3}
                    value={form.short_description}
                    onChange={(event) => updateField("short_description", event.target.value)}
                    placeholder="Короткий текст, который быстро объясняет ценность маршрута."
                  />
                </FormField>

                <FormField label="Полное описание">
                  <TextArea
                    rows={7}
                    value={form.full_description}
                    onChange={(event) => updateField("full_description", event.target.value)}
                    placeholder="Подробно расскажите о впечатлениях, локациях и формате путешествия."
                  />
                </FormField>

                <div className="grid gap-5 md:grid-cols-4">
                  <FormField label="Цена от">
                    <div className="relative">
                      <CreditCard className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                      <TextInput
                        value={form.price_from}
                        onChange={(event) => updateField("price_from", event.target.value)}
                        placeholder="от 4 000 ₽"
                        className="pl-11"
                      />
                    </div>
                  </FormField>
                  <FormField label="Длительность">
                    <div className="relative">
                      <Clock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                      <TextInput
                        value={form.duration}
                        onChange={(event) => updateField("duration", event.target.value)}
                        placeholder="1 день"
                        className="pl-11"
                      />
                    </div>
                  </FormField>
                  <FormField label="Группа">
                    <div className="relative">
                      <Users className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                      <TextInput
                        value={form.group_size}
                        onChange={(event) => updateField("group_size", event.target.value)}
                        placeholder="до 6 человек"
                        className="pl-11"
                      />
                    </div>
                  </FormField>
                  <FormField label="Локация">
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                      <TextInput
                        value={form.location}
                        onChange={(event) => updateField("location", event.target.value)}
                        placeholder="Северная Осетия"
                        className="pl-11"
                      />
                    </div>
                  </FormField>
                </div>
              </Section>

              <Section
                title="Медиа и галерея"
                description="Обложка влияет на первое впечатление, а галерея помогает раскрыть маршрут глубже."
              >
                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                  <FormField label="Обложка тура">
                    <ImageUpload
                      value={form.cover_image_url}
                      onChange={(url) => updateField("cover_image_url", url)}
                      label="Обложка маршрута"
                      description="Используйте сильный атмосферный кадр, который хорошо читается в каталоге."
                    />
                  </FormField>

                  <div className="space-y-4">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <div className="admin-kicker mb-2">Галерея</div>
                        <p className="text-sm text-stone-500">
                          Добавляйте дополнительные фотографии через URL или загрузку в хранилище.
                        </p>
                      </div>
                      <Badge tone="accent">{form.gallery.length} фото</Badge>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {form.gallery.map((image, index) => (
                        <div key={`${image}-${index}`} className="group relative overflow-hidden rounded-[1.2rem] border border-stone-200 bg-stone-100">
                          <div className="aspect-square">
                            <img src={image} alt={`Gallery ${index + 1}`} className="h-full w-full object-cover" />
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              updateField(
                                "gallery",
                                form.gallery.filter((_, imageIndex) => imageIndex !== index),
                              )
                            }
                            className="absolute inset-0 flex items-center justify-center bg-stone-950/55 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="flex aspect-square flex-col items-center justify-center gap-3 rounded-[1.2rem] border-2 border-dashed border-stone-200 bg-white/70 text-stone-400 transition-colors hover:border-accent-500/40 hover:text-accent-600"
                      >
                        {galleryUploading ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          <ImagePlus className="h-6 w-6" />
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-[0.26em]">
                          Загрузить фото
                        </span>
                      </button>
                    </div>

                    <input
                      type="file"
                      ref={galleryInputRef}
                      onChange={uploadGalleryImage}
                      accept="image/*"
                      className="hidden"
                    />

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <TextInput
                        value={galleryDraft}
                        onChange={(event) => setGalleryDraft(event.target.value)}
                        placeholder="Или вставьте ссылку на изображение"
                      />
                      <button type="button" onClick={() => addGalleryItem()} className="admin-button-secondary shrink-0">
                        <Plus className="h-4 w-4" />
                        Добавить
                      </button>
                    </div>
                  </div>
                </div>
              </Section>

              <Section
                title="Программа тура"
                description="Опишите шаги маршрута в нужном порядке. Каждый блок должен быть самостоятельным и понятным."
                actions={
                  <button type="button" onClick={addProgramItem} className="admin-button-secondary">
                    <Plus className="h-4 w-4" />
                    Добавить пункт
                  </button>
                }
              >
                {form.program_items.length === 0 ? (
                  <EmptyState
                    icon={Layers}
                    title="Программа пока пустая"
                    description="Добавьте хотя бы один пункт, если на странице маршрута нужен подробный сценарий поездки."
                    action={
                      <button type="button" onClick={addProgramItem} className="admin-button-secondary">
                        Создать первый пункт
                      </button>
                    }
                  />
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {form.program_items.map((item, index) => (
                        <motion.div
                          key={`${index}-${item.title}`}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          className="admin-subtle-panel p-5"
                        >
                          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-sm font-bold text-white">
                                {index + 1}
                              </div>
                              <div>
                                <div className="admin-kicker mb-1">Пункт программы</div>
                                <div className="text-sm text-stone-500">Описание локации или этапа маршрута.</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => moveProgramItem(index, "up")}
                                disabled={index === 0}
                                className="admin-button-secondary px-3 py-2 disabled:opacity-40"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveProgramItem(index, "down")}
                                disabled={index === form.program_items.length - 1}
                                className="admin-button-secondary px-3 py-2 disabled:opacity-40"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeProgramItem(index)}
                                className="admin-button-secondary px-3 py-2 text-red-600 hover:border-red-500/30 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                            <FormField label="Изображение">
                              <ImageUpload
                                value={item.image_url}
                                onChange={(url) => updateProgramItem(index, { image_url: url })}
                                label={`Пункт ${index + 1}`}
                                description="Подберите фото, которое визуально объясняет этот этап маршрута."
                                aspectClassName="aspect-[16/12]"
                              />
                            </FormField>

                            <div className="grid gap-5">
                              <FormField label="Заголовок пункта">
                                <TextInput
                                  value={item.title}
                                  onChange={(event) => updateProgramItem(index, { title: event.target.value })}
                                  placeholder="Например: Сказский ледник"
                                />
                              </FormField>
                              <FormField label="Описание">
                                <TextArea
                                  rows={6}
                                  value={item.description}
                                  onChange={(event) =>
                                    updateProgramItem(index, { description: event.target.value })
                                  }
                                  placeholder="Что увидит турист и зачем этот этап маршрута важен?"
                                />
                              </FormField>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </Section>

              <Section
                title="SEO и порядок выдачи"
                description="Метаданные помогают поиску, а порядок сортировки влияет на расположение тура в каталоге."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField label="SEO title">
                    <TextInput
                      value={form.seo_title}
                      onChange={(event) => updateField("seo_title", event.target.value)}
                      placeholder="Авторский тур в Цейское ущелье"
                    />
                  </FormField>
                  <FormField label="Порядок сортировки">
                    <TextInput
                      type="number"
                      value={String(form.sort_order)}
                      onChange={(event) => updateField("sort_order", Number(event.target.value) || 0)}
                      placeholder="0"
                    />
                  </FormField>
                </div>

                <FormField label="SEO description">
                  <TextArea
                    rows={4}
                    value={form.seo_description}
                    onChange={(event) => updateField("seo_description", event.target.value)}
                    placeholder="Короткое описание для поисковой выдачи и социальных превью."
                  />
                </FormField>
              </Section>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
