import { FormEvent, useEffect, useState } from "react";
import { adminApi, authStorage, uploadToSupabaseStorage } from "../lib/api";
import type { HomeContent, Tour } from "../lib/types";

type EditableHome = Omit<HomeContent, "id" | "updated_at" | "featured_tours">;

export default function AdminHome() {
  const [home, setHome] = useState<EditableHome | null>(null);
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [homeData, toursData] = await Promise.all([adminApi.getHome(), adminApi.getTours()]);
      setHome({
        hero_title: homeData.hero_title,
        hero_subtitle: homeData.hero_subtitle,
        hero_image_url: homeData.hero_image_url,
        featured_tour_ids: homeData.featured_tour_ids,
        cta_title: homeData.cta_title,
        cta_text: homeData.cta_text,
        cta_primary_label: homeData.cta_primary_label,
        cta_primary_url: homeData.cta_primary_url,
        cta_secondary_label: homeData.cta_secondary_label,
        cta_secondary_url: homeData.cta_secondary_url,
      });
      setAllTours(toursData);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u043a\u043e\u043d\u0442\u0435\u043d\u0442 \u0433\u043b\u0430\u0432\u043d\u043e\u0439",
      );
    } finally {
      setLoading(false);
    }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!home) return;
    setSaving(true);
    setError("");
    try {
      await adminApi.updateHome(home);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043a\u043e\u043d\u0442\u0435\u043d\u0442",
      );
    } finally {
      setSaving(false);
    }
  }

  async function uploadHero(file: File) {
    const token = authStorage.getToken();
    if (!token || !home) return;
    try {
      const url = await uploadToSupabaseStorage(file, token);
      setHome({ ...home, hero_image_url: url });
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

  if (loading)
    return <p>{"\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0433\u043b\u0430\u0432\u043d\u043e\u0439..."}</p>;
  if (!home)
    return <p>{"\u041a\u043e\u043d\u0442\u0435\u043d\u0442 \u0433\u043b\u0430\u0432\u043d\u043e\u0439 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d."}</p>;

  return (
    <form onSubmit={save} className="grid gap-4">
      <h1 className="text-2xl font-semibold">
        {"\u041a\u043e\u043d\u0442\u0435\u043d\u0442 \u0433\u043b\u0430\u0432\u043d\u043e\u0439"}
      </h1>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <input
        className="rounded-md border border-stone-300 px-3 py-2"
        value={home.hero_title}
        onChange={(e) => setHome({ ...home, hero_title: e.target.value })}
        placeholder="Hero title"
      />
      <textarea
        className="rounded-md border border-stone-300 px-3 py-2"
        rows={3}
        value={home.hero_subtitle}
        onChange={(e) => setHome({ ...home, hero_subtitle: e.target.value })}
        placeholder="Hero subtitle"
      />
      <input
        className="rounded-md border border-stone-300 px-3 py-2"
        value={home.hero_image_url}
        onChange={(e) => setHome({ ...home, hero_image_url: e.target.value })}
        placeholder="Hero image URL"
      />
      <label className="text-sm text-stone-600">
        Upload hero image
        <input
          type="file"
          accept="image/*"
          className="mt-1 block w-full"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void uploadHero(file);
          }}
        />
      </label>
      <div>
        <p className="mb-2 text-sm font-medium">
          {"\u0422\u0443\u0440\u044b \u0432 \u0431\u043b\u043e\u043a\u0435 \u00ab\u041f\u043e\u043f\u0443\u043b\u044f\u0440\u043d\u044b\u0435\u00bb (\u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0443\u0435\u0442\u0441\u044f \u0434\u043e 3)"}
        </p>
        <div className="grid gap-2 md:grid-cols-2">
          {allTours.map((tour) => {
            const checked = home.featured_tour_ids.includes(tour.id);
            return (
              <label key={tour.id} className="flex items-center gap-2 rounded border px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setHome({
                        ...home,
                        featured_tour_ids: [...home.featured_tour_ids, tour.id],
                      });
                    } else {
                      setHome({
                        ...home,
                        featured_tour_ids: home.featured_tour_ids.filter((id) => id !== tour.id),
                      });
                    }
                  }}
                />
                {tour.title}
              </label>
            );
          })}
        </div>
      </div>
      <input
        className="rounded-md border border-stone-300 px-3 py-2"
        value={home.cta_title}
        onChange={(e) => setHome({ ...home, cta_title: e.target.value })}
        placeholder="CTA title"
      />
      <textarea
        className="rounded-md border border-stone-300 px-3 py-2"
        rows={3}
        value={home.cta_text}
        onChange={(e) => setHome({ ...home, cta_text: e.target.value })}
        placeholder="CTA text"
      />
      <div className="grid gap-3 md:grid-cols-2">
        <input
          className="rounded-md border border-stone-300 px-3 py-2"
          value={home.cta_primary_label}
          onChange={(e) => setHome({ ...home, cta_primary_label: e.target.value })}
          placeholder="CTA primary label"
        />
        <input
          className="rounded-md border border-stone-300 px-3 py-2"
          value={home.cta_primary_url}
          onChange={(e) => setHome({ ...home, cta_primary_url: e.target.value })}
          placeholder="CTA primary URL"
        />
        <input
          className="rounded-md border border-stone-300 px-3 py-2"
          value={home.cta_secondary_label}
          onChange={(e) => setHome({ ...home, cta_secondary_label: e.target.value })}
          placeholder="CTA secondary label"
        />
        <input
          className="rounded-md border border-stone-300 px-3 py-2"
          value={home.cta_secondary_url}
          onChange={(e) => setHome({ ...home, cta_secondary_url: e.target.value })}
          placeholder="CTA secondary URL"
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="w-fit rounded-md bg-stone-900 px-4 py-2 text-sm text-white"
      >
        {saving
          ? "\u0421\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u0435..."
          : "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0433\u043b\u0430\u0432\u043d\u0443\u044e"}
      </button>
    </form>
  );
}
