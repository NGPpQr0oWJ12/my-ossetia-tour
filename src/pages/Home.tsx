import React from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState, useMemo } from "react";
import { ArrowRight, Compass, Camera, Calendar, Users, Star, Send, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { publicApi } from "../lib/api";
import type { HomeContent, Tour, SiteSettings } from "../lib/types";

const defaultHeroImage = "/12476587.jpg";
const founderImage = "/gid.png";
const storyImage = "/onas.webp";

const INITIAL_DATA: HomeContent = {
  id: 1,
  hero_title: "",
  hero_subtitle: "",
  hero_image_url: defaultHeroImage,
  featured_tour_ids: [],
  cta_title: "",
  cta_text: "",
  cta_primary_label: "",
  cta_primary_url: "",
  cta_secondary_label: "",
  cta_secondary_url: "",
  hero_tour_id: null,
  updated_at: new Date().toISOString(),
  featured_tours: []
};

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 360 362" className={className}>
    <path fill="currentColor" fillRule="evenodd" d="M307.546 52.566C273.709 18.684 228.706.017 180.756 0 81.951 0 1.538 80.404 1.504 179.235c-.017 31.594 8.242 62.432 23.928 89.609L0 361.736l95.024-24.925c26.179 14.285 55.659 21.805 85.655 21.814h.077c98.788 0 179.21-80.413 179.244-179.244.017-47.898-18.608-92.926-52.454-126.807v-.008Zm-126.79 275.788h-.06c-26.73-.008-52.952-7.194-75.831-20.765l-5.44-3.231-56.391 14.791 15.05-54.981-3.542-5.638c-14.912-23.721-22.793-51.139-22.776-79.286.035-82.14 66.867-148.973 149.051-148.973 39.793.017 77.198 15.53 105.328 43.695 28.131 28.157 43.61 65.596 43.593 105.398-.035 82.149-66.867 148.982-148.982 148.982v.008Zm81.719-111.577c-4.478-2.243-26.497-13.073-30.606-14.568-4.108-1.496-7.09-2.243-10.073 2.243-2.982 4.487-11.568 14.577-14.181 17.559-2.613 2.991-5.226 3.361-9.704 1.117-4.477-2.243-18.908-6.97-36.02-22.226-13.313-11.878-22.304-26.54-24.916-31.027-2.613-4.486-.275-6.91 1.959-9.136 2.011-2.011 4.478-5.234 6.721-7.847 2.244-2.613 2.983-4.486 4.478-7.469 1.496-2.991.748-5.603-.369-7.847-1.118-2.243-10.073-24.289-13.812-33.253-3.636-8.732-7.331-7.546-10.073-7.692-2.613-.13-5.595-.155-8.586-.155-2.991 0-7.839 1.118-11.947 5.604-4.108 4.486-15.677 15.324-15.677 37.361s16.047 43.344 18.29 46.335c2.243 2.991 31.585 48.225 76.51 67.632 10.684 4.615 19.029 7.374 25.535 9.437 10.727 3.412 20.49 2.931 28.208 1.779 8.604-1.289 26.498-10.838 30.228-21.298 3.73-10.46 3.73-19.433 2.613-21.298-1.117-1.865-4.108-2.991-8.586-5.234l.008-.017Z" clipRule="evenodd"/>
  </svg>
);

const ParallaxImage = ({ src, alt, speed = 0.1 }: { src: string; alt: string; speed?: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`]);

  return (
    <div ref={ref} className="w-full h-full overflow-hidden relative">
      <motion.img
        style={{ y, scale: 1.2 }}
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-[140%] object-cover pointer-events-none"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

interface TourCardProps {
  tour: Tour;
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  return (
    <div className="group">
      <Link to={`/tours/${tour.slug || tour.id}`} className="block relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-stone-100 shadow-sm hover:shadow-2xl transition-all duration-700">
        <div className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-110">
          <img
            src={tour.cover_image_url}
            alt={tour.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/40 transition-colors duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-90" />
        </div>

        <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
            <span className="text-white text-[10px] font-bold tracking-[0.2em] uppercase">{tour.duration}</span>
          </div>
          <div className="bg-amber-600/90 backdrop-blur-sm px-4 py-2 rounded-2xl">
            <span className="text-white text-xs font-bold tracking-tight">от {tour.price_from} ₽</span>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 right-8 z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
          <div className="flex items-center gap-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <Users className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-white/60 text-[10px] uppercase tracking-widest font-medium">до {tour.group_size} чел</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-serif text-white leading-[1.2] group-hover:text-amber-100 transition-colors">
            {tour.title}
          </h3>
          <div className="mt-6 flex items-center gap-3 text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
            <span>Маршрут тура</span>
            <div className="w-8 h-px bg-white/20 group-hover:w-12 transition-all duration-500" />
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default function Home() {
  const [data, setData] = useState<HomeContent>(INITIAL_DATA);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [homeForm, setHomeForm] = useState({ name: "", phone: "+7", tour_id: "" });
  const [homeSubmitted, setHomeSubmitted] = useState(false);
  const [homeIsSubmitting, setHomeIsSubmitting] = useState(false);
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    Promise.all([
      publicApi.getHome(),
      publicApi.getSiteSettings()
    ]).then(([homeRes, settingsRes]) => {
      if (homeRes) setData(homeRes);
      if (settingsRes) setSettings(settingsRes as unknown as SiteSettings);
    }).finally(() => setLoading(false));
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

  const handleHomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (homeIsSubmitting) return;

    const digits = homeForm.phone.replace(/\D/g, "");
    if (digits.length < 11) {
      alert("Пожалуйста, введите полный номер телефона");
      return;
    }

    try {
      setHomeIsSubmitting(true);
      await publicApi.createLead({
        source_page: "home_cta",
        tour_id: homeForm.tour_id ? Number(homeForm.tour_id) : null,
        name: homeForm.name,
        phone: homeForm.phone,
        message: homeForm.tour_id ? `Интересует тур ID: ${homeForm.tour_id}` : "Заявка с главной страницы",
      });
      setHomeSubmitted(true);
    } catch {
      alert("Ошибка при отправке. Попробуйте еще раз.");
    } finally {
      setHomeIsSubmitting(false);
    }
  };

  const featuredTours = data.featured_tours || [];

  // Определяем тур для Hero-блока
  const primaryFeatured = useMemo(() => {
    if (data?.hero_tour_id) {
      const found = featuredTours.find((t) => Number(t.id) === Number(data.hero_tour_id));
      if (found) return found;
    }
    return featuredTours[0] || null;
  }, [featuredTours, data?.hero_tour_id]);

  const renderTitle = (title: string) => {
    if (!title) return null;
    const parts = title.split(/(настоящую)/i);
    return parts.map((part, i) => 
      part.toLowerCase() === "настоящую" 
        ? <span key={i} className="text-accent-500">{part}</span> 
        : part
    );
  };

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden w-full flex flex-col items-center pt-24 pb-8 sm:pt-32 sm:pb-16">
        <motion.div style={{ y: yHero }} className="absolute inset-0 z-0 w-full h-[140%] -top-[20%]">
          <img
            src={data.hero_image_url || defaultHeroImage}
            alt="Кавказские горы"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-stone-900/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/60 via-stone-900/20 to-transparent opacity-30" />
        </motion.div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col justify-center py-8 md:py-12">
          <div className="w-full grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 items-center">
            <div className="grid min-w-0">
              {loading ? (
                <div className="flex flex-col space-y-8 animate-pulse">
                  <div className="space-y-4">
                    <div className="h-[6vw] min-h-[3rem] w-3/4 bg-white/20 rounded-[2rem]" />
                    <div className="h-[6vw] min-h-[3rem] w-1/2 bg-white/20 rounded-[2rem]" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-6 w-full bg-white/10 rounded-xl" />
                    <div className="h-6 w-2/3 bg-white/10 rounded-xl" />
                  </div>
                  <div className="h-16 w-[28rem] bg-white/10 rounded-3xl" />
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col"
                >
                  <h1 className="mb-8 font-serif text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95] text-white drop-shadow-2xl sm:mb-10 sm:leading-[0.9] xl:mb-12 xl:text-[clamp(4.5rem,6vw,6.5rem)] whitespace-pre-line">
                    {renderTitle(data.hero_title)}
                  </h1>

                  <p className="mb-12 max-w-2xl text-[1rem] font-light leading-relaxed text-white/92 drop-shadow-lg sm:mb-12 sm:text-xl lg:text-2xl xl:mb-12 xl:text-3xl">
                    {data.hero_subtitle}
                  </p>

                  <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                    <Link
                      to="/tours"
                      className="group btn-glass sm:w-[26rem] xl:w-[28rem] min-[1700px]:w-[32rem] min-[1700px]:min-h-[5.5rem] min-[1700px]:text-base"
                    >
                      <span className="relative z-10 flex items-center gap-4">Выбрать тур <ArrowRight className="h-5 w-5" /></span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Popular Route Sticky Sidebar Style */}
            <div className="hidden lg:grid justify-items-end self-end">
              {primaryFeatured && (
                <div className="relative w-full max-w-[24rem] xl:max-w-[26rem]">
                  <div className="group relative overflow-hidden rounded-[34px] border border-white/30 bg-stone-900/10 p-6 text-white shadow-[0_40px_80px_rgba(0,0,0,0.36)] backdrop-blur-3xl xl:p-7 2xl:p-8 min-[1700px]:rounded-[40px] min-[1700px]:p-9">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-60" />
                    
                    <div className="relative z-10">
                      <div className="mb-4 flex items-center justify-between 2xl:mb-5 min-[1700px]:mb-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-accent-400/30 bg-accent-400/10 px-4 py-1.5 text-[8px] font-bold uppercase tracking-[0.24em] text-accent-300 min-[1700px]:px-5 min-[1700px]:py-2 min-[1700px]:text-[9px] min-[1700px]:tracking-[0.3em]">
                          <Star className="h-3 w-3 fill-accent-400 text-accent-400" />
                          Популярный маршрут
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/40 min-[1700px]:text-[10px] min-[1700px]:tracking-[0.2em]">
                          <Clock className="h-3 w-3" /> {primaryFeatured.duration}
                        </div>
                      </div>

                      <h3 className="mb-3 font-serif text-[2.5rem] font-bold leading-[0.98] text-white xl:text-[2.75rem] 2xl:text-[3rem] min-[1700px]:mb-6 min-[1700px]:text-5xl">
                        {primaryFeatured.title}
                      </h3>

                      <p className="mb-4 text-sm font-light leading-relaxed text-white/80 2xl:text-base min-[1700px]:mb-8 min-[1700px]:text-lg">
                        {primaryFeatured.short_description}
                      </p>

                      <div>
                        <Link
                          to={`/tours/${primaryFeatured.slug || primaryFeatured.id}`}
                          className="group btn-sm group/btn w-full justify-between gap-4 px-6 py-4 text-[11px] min-[1700px]:px-8 min-[1700px]:py-5 min-[1700px]:text-xs"
                        >
                          Смотреть <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tours Catalog */}
      {featuredTours.length > 0 && (
        <section className="py-36 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <span className="h-px w-8 bg-amber-600/40" />
                  <span className="text-xs font-bold tracking-[0.4em] uppercase text-stone-400">Маршруты</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 leading-tight">
                  Популярные <br />
                  <span className="font-light text-stone-400">направления</span>
                </h2>
              </div>
              <Link to="/tours" className="group flex flex-col items-end gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-900 transition-colors group-hover:text-amber-600">Смотреть все туры</span>
                <div className="flex items-center">
                  <div className="w-24 h-px bg-stone-200 group-hover:bg-amber-600 group-hover:w-32 transition-all duration-700"></div>
                  <ArrowRight className="w-3 h-3 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all duration-700" />
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
              {featuredTours.map((tour: Tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="relative py-36 overflow-hidden" style={{ backgroundColor: '#f8f9ff' }}>
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.08] pointer-events-none" style={{ background: 'radial-gradient(circle, #ffdcc3, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.06] pointer-events-none" style={{ background: 'radial-gradient(circle, #ffdcc3, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-20 lg:gap-32 items-center">
            <div className="relative">
              <div className="relative z-10 grid grid-cols-12 grid-rows-12 h-[520px] md:h-[640px]">
                <div className="col-start-1 col-span-10 row-start-1 row-span-11 overflow-hidden rounded-[3rem] relative group" style={{ boxShadow: '0 10px 40px rgba(18,28,40,0.04)' }}>
                  <img src={storyImage} alt="Горы и сторожевые башни Осетии" className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 via-transparent to-transparent group-hover:from-transparent transition-all duration-700" />
                </div>
                <div className="col-start-6 col-span-7 row-start-6 row-span-7 z-20 overflow-hidden rounded-[2rem]" style={{ border: '10px solid white', boxShadow: '0 10px 40px rgba(18,28,40,0.04), -20px 20px 60px rgba(18,28,40,0.08)' }}>
                  <img src={founderImage} alt="Основатель My Ossetia Tours" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-6 -left-6 w-[85%] h-[88%] rounded-[3.5rem] -z-10" style={{ border: '1px solid rgba(217,119,6,0.15)' }} />
              </div>
            </div>

            <div className="relative">
              <div>
                <div className="flex items-center gap-4 mb-10">
                  <span className="h-px w-12" style={{ backgroundColor: '#D97706' }} />
                  <span className="text-xs font-bold tracking-[0.45em] uppercase" style={{ color: '#8d4b00' }}>Основано в 2014</span>
                </div>
                <h2 className="mb-10 leading-[1.05] text-4xl md:text-5xl lg:text-6xl text-[#121c28]">Мы знаем горы<br /><span className="text-[#887364]">как свои пять пальцев</span></h2>
                <p className="text-lg font-light leading-relaxed mb-14 max-w-lg" style={{ color: '#554336' }}>Наши гиды — коренные жители Осетии, влюблённые в каждый склон Кавказского хребта. Мы создаём не просто туры, а глубокое погружение в аутентичную культуру через живые маршруты.</p>
                <div className="grid gap-5 mb-14">
                  {[
                    { icon: <Compass className="w-5 h-5" />, title: "Авторские маршруты", text: "Уникальные тропы вдали от туристического шума." },
                    { icon: <Users className="w-5 h-5" />, title: "Мини-группы", text: "Максимум внимания каждому участнику и комфорт." },
                    { icon: <Camera className="w-5 h-5" />, title: "Эстетика в деталях", text: "Тщательно отобранные точки для лучших кадров." }
                  ].map((item, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.02 }} className="flex items-start gap-5 p-5 rounded-2xl cursor-default transition-colors duration-300 hover:bg-[#eef4ff]">
                      <div className="shrink-0 p-3.5 rounded-xl bg-white shadow-sm">
                        <div style={{ color: '#D97706' }}>{item.icon}</div>
                      </div>
                      <div>
                        <h4 className="text-lg mb-1" style={{ color: '#121c28' }}>{item.title}</h4>
                        <p className="text-sm font-light leading-relaxed" style={{ color: '#554336' }}>{item.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Link to="/about" className="group inline-flex items-center gap-5 py-3">
                  <span className="text-xs font-bold tracking-[0.25em] uppercase transition-colors" style={{ color: '#121c28' }}>Узнать больше о команде</span>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #8d4b00, #b15f00)', boxShadow: '0 4px 20px rgba(141,75,0,0.2)' }}>
                    <ArrowRight className="h-4 w-4 text-white transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl mb-12">Ваш гид</h2>
          <div className="mb-8 inline-block">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto bg-stone-200">
              <img 
                src={settings?.guide_image_url || founderImage} 
                alt={`Гид ${settings?.guide_name || "Тимур"}`} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
              />
            </div>
          </div>
          <div className="space-y-6 text-stone-700 leading-relaxed text-left md:text-center">
            <p className="whitespace-pre-line">
              {settings?.guide_bio || "Меня зовут Тимур. Я родился и вырос в Северной Осетии, с самого детства люблю нашу природу и горы..."}
            </p>
            <p>По окончанию экскурсии мы дарим каждому гостю небольшой набор сувениров от нашего магазина My Ossetia Store.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParallaxImage src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000" alt="Закат в горах" speed={0.12} />
          <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-md" />
        </div>

        <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-col px-6 py-12 lg:px-8 xl:py-24">
          <div className="grid grid-cols-1 items-stretch gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
            <div className="flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center gap-4 sm:mb-8">
                  <span className="font-mono text-xs font-bold tracking-widest text-amber-400 drop-shadow-md uppercase">42°50′21″N 44°24′15″E</span>
                  <div className="h-px w-12 bg-white/40 drop-shadow-md" />
                </div>
                <h2 className="mb-6 font-serif text-4xl leading-[1.05] text-white drop-shadow-md md:text-5xl lg:text-6xl">
                  {data.cta_title || "Готовы к незабываемому путешествию?"}
                </h2>
                <p className="mb-10 text-lg font-medium leading-relaxed text-white drop-shadow-md lg:text-xl whitespace-pre-line">
                  {data.cta_text || "Напишите нам, и мы подберем идеальный авторский маршрут..."}
                </p>
              </div>

              <div className="mt-auto flex flex-col gap-4 sm:flex-row">
                {data.cta_primary_label && (
                   <Link to={data.cta_primary_url || "/tours"} className="group btn-primary !bg-[#25D366] hover:!bg-[#20bd5a] shadow-[0_0_30px_rgba(37,211,102,0.25)]">
                     <WhatsAppIcon className="mr-3 h-5 w-5" />
                     {data.cta_primary_label}
                   </Link>
                )}
                {data.cta_secondary_label && (
                  <Link to={data.cta_secondary_url || "/contacts"} className="group btn-glass !border-stone-700/50 !bg-white/5 hover:!bg-white/10">
                    <Send className="mr-3 h-5 w-5" />
                    {data.cta_secondary_label}
                  </Link>
                )}
              </div>
            </div>

            <div className="flex w-full flex-col justify-center overflow-hidden rounded-[2.5rem] border border-white/20 bg-stone-900/40 p-8 shadow-[0_40px_80px_rgba(0,0,0,0.5)] backdrop-blur-3xl md:ml-auto lg:p-10 min-h-[400px]">
              <AnimatePresence mode="wait">
                {homeSubmitted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center space-y-6"
                  >
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-serif text-white">Заявка принята!</h3>
                    <p className="text-white/60 text-sm leading-relaxed max-w-[240px]">
                      Менеджер свяжется с вами в ближайшее время.
                    </p>
                    <button 
                      onClick={() => setHomeSubmitted(false)}
                      className="text-white/40 text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                    >
                      Отправить еще одну
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h3 className="mb-8 text-center text-3xl leading-[1.1] text-white">Оставить заявку</h3>
                    <form className="flex h-full flex-col justify-between" onSubmit={handleHomeSubmit}>
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-[10px] font-bold tracking-widest text-white/50 uppercase">Ваше имя</label>
                            <input 
                              type="text" 
                              required
                              value={homeForm.name}
                              onChange={(e) => setHomeForm(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full border-b border-white/20 bg-transparent px-0 py-2 text-base text-white placeholder-white/30 focus:border-accent-500 focus:outline-none" 
                              placeholder="Иван Иванов" 
                            />
                          </div>
                          <div>
                            <label className="mb-2 block text-[10px] font-bold tracking-widest text-white/50 uppercase">Телефон</label>
                            <input 
                              type="tel" 
                              required
                              value={homeForm.phone}
                              onChange={(e) => setHomeForm(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                              className="w-full border-b border-white/20 bg-transparent px-0 py-2 text-base text-white placeholder-white/30 focus:border-accent-500 focus:outline-none" 
                              placeholder="+7 (___) ___-__-__" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 block text-[10px] font-bold tracking-widest text-white/50 uppercase">Интересующий тур</label>
                          <select 
                            value={homeForm.tour_id}
                            onChange={(e) => setHomeForm(prev => ({ ...prev, tour_id: e.target.value }))}
                            className="w-full appearance-none border-b border-white/20 bg-transparent px-0 py-2 text-base text-white focus:border-accent-500 focus:outline-none [&>option]:bg-stone-900"
                          >
                            <option value="">Выберите тур из списка</option>
                            {featuredTours.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="mt-6">
                        <button type="submit" disabled={homeIsSubmitting} className="group btn-primary w-full flex items-center justify-center gap-3">
                          {homeIsSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Отправить"}
                        </button>
                        <p className="mt-4 text-center text-[9px] leading-relaxed tracking-wider text-white/40 uppercase">Нажимая кнопку, вы соглашаетесь с<br /> политикой обработки данных.</p>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
