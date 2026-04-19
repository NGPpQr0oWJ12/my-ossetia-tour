import { CheckCircle2, Loader2, MapPin, Phone, Mail, Clock } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { publicApi } from "../lib/api";
import type { Tour, SiteSettings } from "../lib/types";

const DEFAULT_SETTINGS = {
  contacts_title: "Свяжитесь с нами",
  contacts_subtitle: "Мы готовы ответить на любые вопросы и организовать тур вашей мечты",
  office_text: "г. Владикавказ, пр. Мира, 1\nРеспублика Северная Осетия-Алания",
  phones_text: "+7 (999) 123-45-67\n+7 (999) 765-43-21",
  email_text: "travel@myossetia.ru",
  schedule_text: "Ежедневно: 09:00 – 20:00\nБез выходных",
};

export default function Contacts() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [form, setForm] = useState({ name: "", phone: "+7", tourId: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const [siteSettings, toursData] = await Promise.all([
          publicApi.getSiteSettings(),
          publicApi.getTours(),
        ]);
        if (siteSettings) setSettings(siteSettings as unknown as SiteSettings);
        setTours(toursData);
      } catch {
        // keep defaults
      }
    })();
  }, []);

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (digits.length === 0) return "+7";
    const clean = digits.startsWith("7") ? digits : "7" + digits;
    const limited = clean.slice(0, 11);
    let res = "+7";
    if (limited.length > 1) res += " (" + limited.slice(1, 4);
    if (limited.length > 4) res += ") " + limited.slice(4, 7);
    if (limited.length > 7) res += "-" + limited.slice(7, 9);
    if (limited.length > 9) res += "-" + limited.slice(9, 11);
    return res;
  };

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;

    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 11) {
      alert("Пожалуйста, введите полный номер телефона");
      return;
    }

    try {
      setIsSubmitting(true);
      await publicApi.createLead({
        source_page: "contacts",
        tour_id: form.tourId ? Number(form.tourId) : null,
        name: form.name,
        phone: form.phone,
        message: form.message,
      });
      setSubmitted(true);
      setForm({ name: "", phone: "+7", tourId: "", message: "" });
    } catch {
      alert("Ошибка при отправке. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
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
                <div className="bg-white p-3 rounded-full shadow-sm text-amber-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-stone-900 mb-1">Офис</h4>
                  <p className="text-stone-600 whitespace-pre-line">{settings?.office_text || DEFAULT_SETTINGS.office_text}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm text-amber-600">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-stone-900 mb-1">Телефон</h4>
                  <p className="text-stone-600 whitespace-pre-line">
                    {settings?.phones_text || DEFAULT_SETTINGS.phones_text}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm text-amber-600">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-stone-900 mb-1">Email</h4>
                  <p className="text-stone-600">{settings?.email_text || DEFAULT_SETTINGS.email_text}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm text-amber-600">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-stone-900 mb-1">Режим работы</h4>
                  <p className="text-stone-600 whitespace-pre-line">{settings?.schedule_text || DEFAULT_SETTINGS.schedule_text}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative min-h-[400px] flex flex-col">
            <h3 className="text-2xl mb-8">Оставить заявку</h3>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-stone-50 rounded-3xl p-10 flex flex-col items-center text-center justify-center flex-grow"
                >
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-serif mb-4">Заявка принята!</h4>
                  <p className="text-stone-600 max-w-[280px] mb-8">
                    Мы получили ваше сообщение и свяжемся с вами в ближайшее время.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-amber-700 text-sm font-bold uppercase tracking-widest hover:text-amber-800 transition-colors"
                  >
                    Отправить еще раз
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                          className="w-full px-4 py-3 rounded-none border-b border-stone-200 focus:outline-none focus:border-accent-500 transition-colors bg-transparent italic"
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
                          onChange={(e) => setForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }))}
                          className="w-full px-4 py-3 rounded-none border-b border-stone-200 focus:outline-none focus:border-accent-500 transition-colors bg-transparent italic"
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
                        className="w-full px-4 py-3 rounded-none border-b border-stone-200 focus:outline-none focus:border-accent-500 transition-colors bg-transparent appearance-none italic"
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
                        className="w-full px-4 py-3 rounded-none border-b border-stone-200 focus:outline-none focus:border-accent-500 transition-colors bg-transparent resize-none italic"
                        placeholder="Напишите ваши пожелания, даты поездки и количество человек..."
                      ></textarea>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="group btn-primary w-full flex items-center justify-center gap-3">
                      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Отправить заявку"}
                    </button>

                    <p className="text-xs text-stone-500 text-center mt-4">
                      Нажимая кнопку «Отправить заявку», вы соглашаетесь с политикой обработки персональных данных.
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
