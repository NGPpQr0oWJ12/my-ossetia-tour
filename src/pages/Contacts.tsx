import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { publicApi, publicSettingsApi } from "../lib/api";
import type { Tour } from "../lib/types";

const DEFAULT_SETTINGS = {
  contacts_title: "Свяжитесь с нами",
  contacts_subtitle: "Мы готовы ответить на любые вопросы и организовать тур вашей мечты",
  office_text: "г. Владикавказ, пр. Мира, 1\nРеспублика Северная Осетия-Алания",
  phones_text: "+7 (999) 123-45-67\n+7 (999) 765-43-21",
  email_text: "travel@myossetia.ru",
  schedule_text: "Ежедневно: 09:00 – 20:00\nБез выходных",
};

export default function Contacts() {
  const [settings, setSettings] = useState<Record<string, string>>(DEFAULT_SETTINGS);
  const [tours, setTours] = useState<Tour[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", tourId: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const [siteSettings, toursData] = await Promise.all([
          publicSettingsApi.getSiteSettings(),
          publicApi.getTours(),
        ]);
        setSettings((prev) => ({ ...prev, ...siteSettings }));
        setTours(toursData);
      } catch {
        // keep defaults
      }
    })();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await publicApi.createLead({
        source_page: "contacts",
        tour_id: form.tourId ? Number(form.tourId) : null,
        name: form.name,
        phone: form.phone,
        message: form.message,
      });
      setSubmitted(true);
      setForm({ name: "", phone: "", tourId: "", message: "" });
    } catch {
      // keep page stable
    }
  }

  const phones = useMemo(
    () => (settings.phones_text ?? "").split("\n").filter(Boolean),
    [settings.phones_text],
  );

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl mb-6">
            {settings.contacts_title}
          </h1>
          <p className="text-xl text-stone-600">{settings.contacts_subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="bg-stone-50 p-10 rounded-3xl">
            <h3 className="text-2xl mb-8">Контактная информация</h3>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm text-forest-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-stone-900 mb-1">Офис</h4>
                  <p className="text-stone-600 whitespace-pre-line">{settings.office_text}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm text-forest-600">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-stone-900 mb-1">Телефон</h4>
                  <p className="text-stone-600 whitespace-pre-line">
                    {phones.join("\n")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm text-forest-600">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-stone-900 mb-1">Email</h4>
                  <p className="text-stone-600">{settings.email_text}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm text-forest-600">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-stone-900 mb-1">Режим работы</h4>
                  <p className="text-stone-600 whitespace-pre-line">{settings.schedule_text}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl mb-8">Оставить заявку</h3>
            <form className="space-y-6" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-none border-b border-stone-200 focus:outline-none focus:border-accent-500 transition-colors bg-transparent"
                    placeholder="Иван Иванов"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-none border-b border-stone-200 focus:outline-none focus:border-accent-500 transition-colors bg-transparent"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tour" className="block text-sm font-medium text-stone-700 mb-2">
                  Интересующий тур
                </label>
                <select
                  id="tour"
                  value={form.tourId}
                  onChange={(e) => setForm((prev) => ({ ...prev, tourId: e.target.value }))}
                  className="w-full px-4 py-3 rounded-none border-b border-stone-200 focus:outline-none focus:border-accent-500 transition-colors bg-transparent appearance-none"
                >
                  <option value="">Выберите тур из списка</option>
                  {tours.map((tour) => (
                    <option key={tour.id} value={String(tour.id)}>
                      {tour.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">
                  Комментарий
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-3 rounded-none border-b border-stone-200 focus:outline-none focus:border-accent-500 transition-colors bg-transparent resize-none"
                  placeholder="Напишите ваши пожелания, даты поездки и количество человек..."
                ></textarea>
              </div>

              <button type="submit" className="group btn-primary w-full">
                Отправить заявку
              </button>
              {submitted ? (
                <p className="text-sm text-green-700">
                  Спасибо! Заявка отправлена, мы свяжемся с вами.
                </p>
              ) : null}

              <p className="text-xs text-stone-500 text-center mt-4">
                Нажимая кнопку «Отправить заявку», вы соглашаетесь с политикой обработки персональных данных.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
