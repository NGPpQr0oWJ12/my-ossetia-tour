import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Image as ImageIcon,
  Save,
  Sparkles,
  Star,
} from "lucide-react";
import { adminApi } from "../lib/api";
import type { HomeContent, Tour } from "../lib/types";
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
} from "./components/AdminUI";
import { cn } from "../lib/utils";

type EditableHome = Omit<HomeContent, "id" | "updated_at" | "featured_tours">;

const FEATURED_LIMIT = 3;

export default function AdminHome() {
  const [home, setHome] = useState<EditableHome | null>(null);
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const [homeData, toursData] = await Promise.all([adminApi.getHome(), adminApi.getTours()]);
      setHome({
        hero_title: homeData.hero_title,
        hero_subtitle: homeData.hero_subtitle,
        hero_image_url: homeData.hero_image_url,
        featured_tour_ids: (homeData.featured_tour_ids || []).map(Number),
        hero_tour_id: homeData.hero_tour_id ? Number(homeData.hero_tour_id) : null,
        cta_title: homeData.cta_title,
        cta_text: homeData.cta_text,
        cta_primary_label: homeData.cta_primary_label,
        cta_primary_url: homeData.cta_primary_url,
        cta_secondary_label: homeData.cta_secondary_label,
        cta_secondary_url: homeData.cta_secondary_url,
      });
      setAllTours(toursData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить контент главной.");
    } finally {
      setLoading(false);
    }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!home) return;

    setSaving(true);
    setError("");
    setStatus("");

    try {
      await adminApi.updateHome(home);
      setStatus("Главная страница сохранена.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить контент.");
    } finally {
      setSaving(false);
    }
  }

  function toggleFeaturedTour(tourId: number) {
    if (!home) return;

    const currentIds = home.featured_tour_ids.map(Number);
    const isSelected = currentIds.includes(tourId);

    if (isSelected) {
      setHome({
        ...home,
        featured_tour_ids: currentIds.filter((id) => id !== tourId),
      });
      return;
    }

    if (currentIds.length >= FEATURED_LIMIT) {
      return;
    }

    setHome({
      ...home,
      featured_tour_ids: [...currentIds, tourId],
    });
  }

  function setHeroTour(tourId: number | null) {
    if (!home) return;
    setHome({
      ...home,
      hero_tour_id: tourId === home.hero_tour_id ? null : tourId,
    });
  }

  useEffect(() => {
    void load();
  }, []);

  const featuredTours = useMemo(
    () => allTours.filter((tour) => home?.featured_tour_ids.map(Number).includes(tour.id)),
    [allTours, home?.featured_tour_ids],
  );

  const heroTour = useMemo(
    () => allTours.find((tour) => tour.id === home?.hero_tour_id),
    [allTours, home?.hero_tour_id],
  );

  if (loading) {
    return <LoadingState title="Загрузка главной" description="Собираем hero-блок, карточки туров и CTA." />;
  }

  if (!home) {
    return (
      <EmptyState
        icon={ImageIcon}
        title="Контент главной не найден"
        description="Проверьте подключение к базе или перезагрузите страницу."
        action={
          <button onClick={() => void load()} className="admin-button-secondary">
            Обновить
          </button>
        }
      />
    );
  }

  const heroReady = Boolean(home.hero_title.trim() && home.hero_subtitle.trim() && home.hero_image_url.trim());
  const ctaReady = Boolean(home.cta_title.trim() && home.cta_primary_label.trim() && home.cta_primary_url.trim());

  return (
    <form onSubmit={save} className="space-y-8">
      <AdminPageHeader
        eyebrow="Контент сайта"
        title="Главная страница"
        description="Управляйте первым экраном, подборкой популярных маршрутов и финальным призывом к действию в одном месте."
        actions={
          <>
            <button
              type="button"
              onClick={() => void load()}
              className="admin-button-secondary"
            >
              Обновить
            </button>
            <button type="submit" disabled={saving} className="admin-button-primary">
              <Save className="h-4 w-4" />
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </>
        }
        meta={
          <>
            <StatCard
              icon={ImageIcon}
              label="Hero"
              value={heroReady ? "Готов" : "Пустой"}
              description="Заголовок, подзаголовок и изображение первого экрана."
              tone={heroReady ? "success" : "accent"}
            />
            <StatCard
              icon={Star}
              label="Популярные туры"
              value={`${featuredTours.length}/${FEATURED_LIMIT}`}
              description="До трёх карточек в основном каталожном блоке."
              tone={featuredTours.length > 0 ? "accent" : "default"}
            />
            <StatCard
              icon={Sparkles}
              label="Финальный CTA"
              value={ctaReady ? "Готов" : "Пустой"}
              description="Финальный баннер с кнопками для конверсии."
              tone={ctaReady ? "success" : "default"}
            />
            <StatCard
              icon={CheckCircle2}
              label="Hero-тур"
              value={heroTour?.title ?? "Не выбран"}
              description="Тур, который будет закреплен на первом экране."
              tone={heroTour ? "success" : "default"}
            />
          </>
        }
      />

      {error ? <Notice tone="danger">{error}</Notice> : null}
      {status ? <Notice tone="success">{status}</Notice> : null}

      <Section
        title="Hero-блок"
        description="Главный экран должен быстро объяснять ценность бренда и задавать тон всему сайту."
      >
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-5">
            <FormField label="Заголовок">
              <TextArea
                rows={3}
                value={home.hero_title}
                onChange={(event) => setHome({ ...home, hero_title: event.target.value })}
                placeholder="Открой настоящую Аланию"
                className="min-h-[8.5rem] resize-none text-lg font-semibold"
              />
            </FormField>
            <FormField label="Подзаголовок">
              <TextArea
                rows={4}
                value={home.hero_subtitle}
                onChange={(event) => setHome({ ...home, hero_subtitle: event.target.value })}
                placeholder="Авторские экспедиции по горной Осетии..."
                className="min-h-[9rem]"
              />
            </FormField>
            <FormField label="Фоновое изображение" hint="Лучше использовать атмосферный кадр с горами">
              <ImageUpload
                value={home.hero_image_url}
                onChange={(url) => setHome({ ...home, hero_image_url: url })}
                label="Изображение первого экрана"
                description="Загрузите фото через Supabase или укажите прямую ссылку."
                aspectClassName="aspect-[16/11]"
              />
            </FormField>
          </div>

          <div className="admin-subtle-panel overflow-hidden">
            <div className="relative min-h-[24rem] overflow-hidden rounded-[1.5rem]">
              {home.hero_image_url ? (
                <img
                  src={home.hero_image_url}
                  alt="Превью hero"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-stone-200" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/25 to-transparent" />
              <div className="relative flex h-full min-h-[24rem] flex-col justify-end p-6 text-white">
                <Badge tone="accent" className="mb-4 w-fit border-white/20 bg-white/10 text-white">
                  Превью первого экрана
                </Badge>
                <h3 className="max-w-md font-serif text-4xl font-extrabold leading-[0.95]">
                  {home.hero_title || "Здесь будет заголовок"}
                </h3>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/78">
                  {home.hero_subtitle || "Добавьте подзаголовок, чтобы увидеть текст поверх изображения."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Популярные туры"
        description="Подберите маршруты, которые должны появиться в витрине на главной. Рекомендуется не больше трёх."
      >
        <Notice tone="accent" title="Лимит подборки">
          Можно выбрать до {FEATURED_LIMIT} туров. Пустые или черновые карточки лучше не поднимать на главную.
        </Notice>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {allTours.map((tour) => {
            const isSelected = home.featured_tour_ids.includes(tour.id);
            const limitReached = !isSelected && home.featured_tour_ids.length >= FEATURED_LIMIT;

            return (
              <div
                key={tour.id}
                onClick={() => !limitReached && toggleFeaturedTour(tour.id)}
                className={cn(
                  "group relative overflow-hidden rounded-[1.5rem] border text-left transition-all duration-300",
                  isSelected
                    ? "border-accent-500/30 bg-accent-500/10 shadow-[0_18px_35px_rgba(188,141,89,0.12)]"
                    : "border-stone-200/80 bg-white/85 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-[0_16px_32px_rgba(28,25,23,0.07)]",
                  limitReached && !isSelected ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                )}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  {tour.cover_image_url ? (
                    <img src={tour.cover_image_url} alt={tour.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-stone-400">
                      Нет обложки
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/65 via-transparent to-transparent" />
                  <div className="absolute left-4 top-4">
                    <Badge
                      tone={tour.is_published ? "success" : "default"}
                      className={tour.is_published ? "bg-emerald-500/15 text-emerald-700" : ""}
                    >
                      {tour.is_published ? "Опубликован" : "Черновик"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-serif text-2xl font-extrabold leading-tight text-stone-900">
                      {tour.title}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setHeroTour(tour.id);
                        }}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full border transition-colors",
                          home.hero_tour_id === tour.id
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-stone-200 bg-white text-stone-400 hover:border-emerald-300 hover:text-emerald-500",
                        )}
                        title={home.hero_tour_id === tour.id ? "Убрать из Hero" : "Сделать Hero-туром"}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </button>
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                          isSelected
                            ? "border-accent-500 bg-accent-500 text-white"
                            : "border-stone-200 bg-white text-stone-500",
                        )}
                      >
                        {isSelected ? "✓" : "+"}
                      </div>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-relaxed text-stone-500">
                    {tour.short_description || "Добавьте краткое описание на странице тура, чтобы карточка выглядела убедительнее."}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {tour.duration ? <Badge>{tour.duration}</Badge> : null}
                    {tour.price_from ? <Badge>{tour.price_from}</Badge> : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section
        title="Финальный CTA"
        description="Последний блок страницы должен мягко подтолкнуть пользователя к следующему действию."
      >
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div className="grid gap-5">
            <FormField label="Заголовок CTA">
              <TextInput
                value={home.cta_title}
                onChange={(event) => setHome({ ...home, cta_title: event.target.value })}
                placeholder="Готовы влюбиться в Осетию?"
              />
            </FormField>
            <FormField label="Текст CTA">
              <TextArea
                rows={4}
                value={home.cta_text}
                onChange={(event) => setHome({ ...home, cta_text: event.target.value })}
                placeholder="Расскажите, какой формат путешествия вам подходит..."
              />
            </FormField>
            <div className="grid gap-5 md:grid-cols-2">
              <FormField label="Текст основной кнопки">
                <TextInput
                  value={home.cta_primary_label}
                  onChange={(event) => setHome({ ...home, cta_primary_label: event.target.value })}
                  placeholder="Подобрать тур"
                />
              </FormField>
              <FormField label="Ссылка основной кнопки">
                <TextInput
                  value={home.cta_primary_url}
                  onChange={(event) => setHome({ ...home, cta_primary_url: event.target.value })}
                  placeholder="/tours"
                />
              </FormField>
              <FormField label="Текст второй кнопки">
                <TextInput
                  value={home.cta_secondary_label}
                  onChange={(event) => setHome({ ...home, cta_secondary_label: event.target.value })}
                  placeholder="Связаться"
                />
              </FormField>
              <FormField label="Ссылка второй кнопки">
                <TextInput
                  value={home.cta_secondary_url}
                  onChange={(event) => setHome({ ...home, cta_secondary_url: event.target.value })}
                  placeholder="/contacts"
                />
              </FormField>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] bg-stone-950 text-white">
            <div className="relative h-full overflow-hidden p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(205,165,119,0.3),transparent_45%)]" />
              <div className="relative flex h-full flex-col justify-between gap-10">
                <div className="space-y-4">
                  <Badge className="border-white/15 bg-white/10 text-white">Превью CTA</Badge>
                  <h3 className="max-w-md font-serif text-4xl font-extrabold leading-[0.95]">
                    {home.cta_title || "Финальный заголовок блока"}
                  </h3>
                  <p className="max-w-lg text-sm leading-relaxed text-white/70">
                    {home.cta_text || "Добавьте текст, чтобы пользователь понял следующий шаг и выгоду обращения."}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-white">
                    {home.cta_primary_label || "Основное действие"}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <div className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-white/90">
                    {home.cta_secondary_label || "Второе действие"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </form>
  );
}
