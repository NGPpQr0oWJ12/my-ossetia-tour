import { FormEvent, useEffect, useMemo, useState } from "react";
import { adminApi, authStorage, uploadToSupabaseStorage } from "../lib/api";
import type { Tour, TourUpsertInput } from "../lib/types";

const EMPTY_FORM: TourUpsertInput = {
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
  program_items: [],
};

export default function AdminTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedId, setSelectedId] = useState<number | "new">("new");
  const [form, setForm] = useState<TourUpsertInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bootstrapping, setBootstrapping] = useState(false);

  const selectedTour = useMemo(
    () => tours.find((item) => item.id === selectedId),
    [selectedId, tours],
  );

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.getTours();
      setTours(data);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0442\u0443\u0440\u044b",
      );
    } finally {
      setLoading(false);
    }
  }

  function selectTour(id: number | "new") {
    setSelectedId(id);
    const tour = tours.find((item) => item.id === id);
    if (!tour) {
      setForm(EMPTY_FORM);
      return;
    }
    setForm({
      slug: tour.slug,
      title: tour.title,
      short_description: tour.short_description,
      full_description: tour.full_description,
      price_from: tour.price_from,
      duration: tour.duration,
      group_size: tour.group_size,
      location: tour.location,
      cover_image_url: tour.cover_image_url,
      gallery: tour.gallery ?? [],
      is_published: tour.is_published,
      sort_order: tour.sort_order,
      seo_title: tour.seo_title,
      seo_description: tour.seo_description,
      program_items: [],
    });
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (selectedTour) {
        await adminApi.updateTour(selectedTour.id, form);
      } else {
        await adminApi.createTour(form);
      }
      await load();
      setSelectedId("new");
      setForm(EMPTY_FORM);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0442\u0443\u0440",
      );
    } finally {
      setSaving(false);
    }
  }

  async function uploadCover(file: File) {
    const token = authStorage.getToken();
    if (!token) return;
    try {
      const url = await uploadToSupabaseStorage(file, token);
      setForm((prev) => ({ ...prev, cover_image_url: url }));
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "\u041e\u0448\u0438\u0431\u043a\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0438",
      );
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function bootstrapDefaults() {
    setBootstrapping(true);
    setError("");
    try {
      await adminApi.bootstrapDefaultContent();
      await load();
      setSelectedId("new");
      setForm(EMPTY_FORM);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Не удалось импортировать текущие туры и контент",
      );
    } finally {
      setBootstrapping(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-[260px_1fr]">
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">{"\u0422\u0443\u0440\u044b"}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => void bootstrapDefaults()}
              disabled={bootstrapping}
              className="rounded-md border border-stone-300 px-2 py-1 text-xs"
            >
              {bootstrapping ? "Импорт..." : "Импортировать текущие"}
            </button>
            <button
              onClick={() => selectTour("new")}
              className="rounded-md bg-stone-900 px-2 py-1 text-xs text-white"
            >
              {"+ \u041d\u043e\u0432\u044b\u0439"}
            </button>
          </div>
        </div>
        {loading ? (
          <p className="text-sm text-stone-500">
            {"\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430..."}
          </p>
        ) : null}
        <div className="space-y-2">
          {tours.map((tour) => (
            <button
              key={tour.id}
              onClick={() => selectTour(tour.id)}
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                selectedId === tour.id ? "border-stone-900 bg-stone-100" : "border-stone-200"
              }`}
            >
              <div className="font-medium">{tour.title}</div>
              <div className="text-xs text-stone-500">{tour.slug}</div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">
          {selectedTour
            ? "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0442\u0443\u0440"
            : "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0442\u0443\u0440"}
        </h2>
        {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
        <form onSubmit={save} className="grid gap-3">
          <input
            className="rounded-md border border-stone-300 px-3 py-2"
            placeholder="Slug"
            value={form.slug}
            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
            required
          />
          <input
            className="rounded-md border border-stone-300 px-3 py-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
          <textarea
            className="rounded-md border border-stone-300 px-3 py-2"
            placeholder="Short description"
            rows={2}
            value={form.short_description}
            onChange={(e) => setForm((prev) => ({ ...prev, short_description: e.target.value }))}
            required
          />
          <textarea
            className="rounded-md border border-stone-300 px-3 py-2"
            placeholder="Full description"
            rows={4}
            value={form.full_description}
            onChange={(e) => setForm((prev) => ({ ...prev, full_description: e.target.value }))}
            required
          />
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="rounded-md border border-stone-300 px-3 py-2"
              placeholder="Price from"
              value={form.price_from}
              onChange={(e) => setForm((prev) => ({ ...prev, price_from: e.target.value }))}
              required
            />
            <input
              className="rounded-md border border-stone-300 px-3 py-2"
              placeholder="Duration"
              value={form.duration}
              onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
              required
            />
            <input
              className="rounded-md border border-stone-300 px-3 py-2"
              placeholder="Group size"
              value={form.group_size}
              onChange={(e) => setForm((prev) => ({ ...prev, group_size: e.target.value }))}
              required
            />
            <input
              className="rounded-md border border-stone-300 px-3 py-2"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>
          <input
            className="rounded-md border border-stone-300 px-3 py-2"
            placeholder="Cover image URL"
            value={form.cover_image_url}
            onChange={(e) => setForm((prev) => ({ ...prev, cover_image_url: e.target.value }))}
            required
          />
          <label className="text-sm text-stone-600">
            {"\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u043e\u0431\u043b\u043e\u0436\u043a\u0438 \u0432 Supabase Storage"}
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadCover(file);
              }}
            />
          </label>
          <textarea
            className="rounded-md border border-stone-300 px-3 py-2"
            placeholder="Gallery URLs (one per line)"
            rows={3}
            value={form.gallery.join("\n")}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                gallery: e.target.value
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean),
              }))
            }
          />
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="rounded-md border border-stone-300 px-3 py-2"
              placeholder="SEO title"
              value={form.seo_title}
              onChange={(e) => setForm((prev) => ({ ...prev, seo_title: e.target.value }))}
              required
            />
            <input
              className="rounded-md border border-stone-300 px-3 py-2"
              placeholder="SEO description"
              value={form.seo_description}
              onChange={(e) => setForm((prev) => ({ ...prev, seo_description: e.target.value }))}
              required
            />
          </div>
          <div className="grid gap-3 md:grid-cols-[120px_120px_auto] md:items-center">
            <input
              className="rounded-md border border-stone-300 px-3 py-2"
              placeholder="Sort"
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm((prev) => ({ ...prev, sort_order: Number(e.target.value) }))}
              required
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm((prev) => ({ ...prev, is_published: e.target.checked }))}
              />
              Published
            </label>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-stone-900 px-3 py-2 text-sm text-white"
            >
              {saving
                ? "\u0421\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u0435..."
                : selectedTour
                  ? "\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c \u0442\u0443\u0440"
                  : "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0442\u0443\u0440"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
