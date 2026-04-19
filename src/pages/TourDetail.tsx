import { AnimatePresence, motion } from "motion/react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Footprints,
  ShieldAlert,
  HeartHandshake,
  HeartPulse,
  Waves,
  IdCard,
  Clock,
  Mountain,
  Users,
  Calendar,
  MapPin,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { publicApi } from "../lib/api";
import type { TourWithProgram } from "../lib/types";

export default function TourDetail() {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tour, setTour] = useState<TourWithProgram | null>(null);
  const [form, setForm] = useState({ name: "", phone: "+7", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    
    void (async () => {
      try {
        const isNumeric = /^\d+$/.test(id);
        const data = isNumeric 
          ? await publicApi.getTourById(Number(id))
          : await publicApi.getTour(id);
        
        setTour(data);
      } catch (err) {
        console.error("Failed to load tour:", err);
        setTour(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const timeline = useMemo(() => {
    if (tour?.program_items?.length) {
      return tour.program_items.map((item) => ({
        title: item.title,
        desc: item.description,
        image: item.image_url,
      }));
    }
    return [
      {
        title: "МАРШРУТ ТУРА",
        desc: "Подробная программа тура будет доступна после наполнения в админ-панели.",
        image: tour?.cover_image_url ?? "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000",
      },
    ];
  }, [tour]);

  const infoCards = [
    {
      icon: <Footprints className="h-6 w-6" />,
      title: "Форма одежды",
      desc: "Берите удобную обувь и одежду по погоде — в горах может быть прохладно.",
    },
    {
      icon: <ShieldAlert className="h-6 w-6" />,
      title: "Безопасность",
      desc: "Соблюдайте правила безопасности на склонах и у водоёмов, прислушивайтесь к советам гида.",
    },
    {
      icon: <HeartHandshake className="h-6 w-6" />,
      title: "Уважение",
      desc: "Уважайте местные традиции и религиозные объекты.",
    },
    {
      icon: <HeartPulse className="h-6 w-6" />,
      title: "Здоровье",
      desc: "Горячие источники и сероводородные источники имеют лечебные свойства, но противопоказаны при серьёзных заболеваниях.",
    },
    {
      icon: <Waves className="h-6 w-6" />,
      title: "Купание",
      desc: "При купании в горячих источниках необходимо взять с собой вещи для купания и средства личной гигиены.",
    },
    {
      icon: <IdCard className="h-6 w-6" />,
      title: "Необходимые документы",
      desc: "Паспорт гражданина РФ или загранпаспорт",
    },
  ];

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (digits.length === 0) return "+7";
    
    // Если начали стирать 7, возвращаем +7
    const clean = digits.startsWith("7") ? digits : "7" + digits;
    const limited = clean.slice(0, 11);
    
    let res = "+7";
    if (limited.length > 1) {
      res += " (" + limited.slice(1, 4);
    }
    if (limited.length > 4) {
      res += ") " + limited.slice(4, 7);
    }
    if (limited.length > 7) {
      res += "-" + limited.slice(7, 9);
    }
    if (limited.length > 9) {
      res += "-" + limited.slice(9, 11);
    }
    return res;
  };

  async function submitLead(event: FormEvent) {
    event.preventDefault();
    if (!tour || isSubmitting) return;
    
    // Простейшая проверка длины (11 цифр включая 7)
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 11) {
      alert("Пожалуйста, введите полный номер телефона");
      return;
    }

    try {
      setIsSubmitting(true);
      await publicApi.createLead({
        source_page: "tour_detail",
        tour_id: tour.id,
        name: form.name,
        phone: form.phone,
        message: form.message,
      });
      setSubmitted(true);
      setForm({ name: "", phone: "+7", message: "" });
      // Не закрываем модалку сразу, чтобы показать анимацию успеха
    } catch {
      alert("Произошла ошибка при отправке. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-4 text-stone-400">
          <Loader2 className="h-10 w-10 animate-spin text-accent-500" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase">Загрузка маршрута...</span>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-stone-100 italic font-serif">
            <h1 className="text-3xl text-stone-900 mb-4">Маршрут не найден</h1>
            <p className="text-stone-500 mb-8">Возможно, он был удален или перемещен.</p>
            <Link to="/tours" className="btn-primary inline-flex">Вернуться к списку</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <Link to="/tours" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Назад к турам
        </Link>

        <div className="relative h-[50vh] min-h-[400px] rounded-3xl overflow-hidden mb-8">
          <img
            src={tour?.cover_image_url ?? "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000"}
            alt={tour?.title ?? "Тур"}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-stone-900/40" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12">
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">
              {tour?.title ?? "Тур"}
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl">
              {tour?.full_description ??
                "Описание тура будет доступно после наполнения в админ-панели."}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8 flex-grow w-full">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-stone-500 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider font-medium">Длительность</span>
              </div>
              <span className="text-stone-900 font-medium">{tour?.duration ?? "—"}</span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-stone-500 mb-1">
                <Mountain className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider font-medium">Сложность</span>
              </div>
              <span className="text-stone-900 font-medium">Легкая</span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-stone-500 mb-1">
                <Users className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider font-medium">Группа</span>
              </div>
              <span className="text-stone-900 font-medium">{tour?.group_size ?? "—"}</span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-stone-500 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider font-medium">Сезон</span>
              </div>
              <span className="text-stone-900 font-medium">Круглый год</span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-stone-500 mb-1">
                <MapPin className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider font-medium">Локация</span>
              </div>
              <span className="text-stone-900 font-medium">{tour?.location ?? "—"}</span>
            </div>
          </div>

          <div className="w-full lg:w-auto flex-shrink-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-stone-100">
            <button onClick={() => setIsModalOpen(true)} className="group btn-primary lg:w-auto">
              <span className="relative z-10 flex items-center gap-4">Записаться на тур</span>
            </button>
            {submitted ? (
              <p className="mt-2 text-sm text-green-700">Заявка отправлена</p>
            ) : null}
          </div>
        </div>
      </div>

      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=2000")', backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-6">Что вас ждет?</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-stone-300 md:-translate-x-1/2"></div>
            {timeline.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={index} className={`relative flex items-center justify-between md:justify-normal mb-12 ${isEven ? "md:flex-row-reverse" : "md:flex-row"}`}>
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-stone-200 rounded-full border-4 border-stone-50 transform -translate-x-1/2 flex items-center justify-center text-xs font-bold text-stone-500 z-10">
                    {index + 1}
                  </div>
                  <div className={`w-full pl-12 md:pl-0 md:w-[calc(50%-3rem)] ${isEven ? "md:pr-12" : "md:pl-12"}`}>
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-48 md:h-64 overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                      </div>
                      <div className="p-6">
                        <h3 className="font-serif text-lg uppercase mb-3 text-stone-900">{item.title}</h3>
                        <p className="text-stone-600 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 text-center mb-16">Важная информация</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {infoCards.map((card, index) => (
              <div key={index} className="bg-stone-100 p-8 rounded-2xl">
                <div className="text-stone-700 mb-4">{card.icon}</div>
                <h3 className="mb-3">{card.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-stone-900 border border-white/10 p-8 shadow-2xl lg:p-10" 
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  if (submitted) setTimeout(() => setSubmitted(false), 500);
                }} 
                className="absolute top-6 right-6 lg:top-8 lg:right-8 text-white/50 hover:text-white transition-colors z-10" 
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-12 flex flex-col items-center text-center"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                      className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-8"
                    >
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-3xl font-serif text-white mb-4">Заявка отправлена!</h3>
                    <p className="text-white/60 max-w-[280px] leading-relaxed">
                      Мы получили ваш запрос и свяжемся с вами в ближайшее время для уточнения деталей.
                    </p>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="mt-10 admin-button-primary bg-white text-stone-900 border-white hover:bg-stone-200"
                    >
                      Понятно
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h3 className="mb-8 text-center font-serif text-3xl leading-[1.1] text-white">Оставить заявку</h3>
                    <form className="flex flex-col gap-5" onSubmit={submitLead}>
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                          <label htmlFor="modal-name" className="mb-2 block text-[10px] font-bold tracking-widest text-white/50 uppercase">Ваше имя</label>
                          <input
                            type="text"
                            id="modal-name"
                            required
                            value={form.name}
                            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                            className="w-full border-b border-white/20 bg-transparent px-0 py-2 text-base text-white placeholder-white/30 transition-colors focus:border-accent-500 focus:outline-none"
                            placeholder="Иван Иванов"
                          />
                        </div>
                        <div>
                          <label htmlFor="modal-phone" className="mb-2 block text-[10px] font-bold tracking-widest text-white/50 uppercase">Телефон</label>
                          <input
                            type="tel"
                            id="modal-phone"
                            required
                            value={form.phone}
                            onChange={(e) => setForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }))}
                            className="w-full border-b border-white/20 bg-transparent px-0 py-2 text-base text-white placeholder-white/30 transition-colors focus:border-accent-500 focus:outline-none tracking-wider"
                            placeholder="+7 (___) ___-__-__"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="modal-message" className="mb-2 block text-[10px] font-bold tracking-widest text-white/50 uppercase">Комментарий к заявке</label>
                        <textarea
                          id="modal-message"
                          rows={2}
                          value={form.message}
                          onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                          className="w-full border-b border-white/20 bg-transparent px-0 py-2 text-base text-white placeholder-white/30 transition-colors focus:border-accent-500 focus:outline-none resize-none"
                          placeholder="Расскажите о ваших пожеланиях..."
                        ></textarea>
                      </div>
                      <div className="mt-4">
                        <button type="submit" disabled={isSubmitting} className="group btn-primary w-full flex items-center justify-center gap-3">
                          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Отправить"}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
