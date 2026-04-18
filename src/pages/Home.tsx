import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, Compass, Camera, Calendar, Users, Star, Phone, Send, Clock } from "lucide-react";
import { Link } from "react-router-dom";
const heroImage = "/12476587.jpg";
const founderImage = "/gid.png";
const storyImage = "/onas.webp";

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

const TourCard = ({ tour, index }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03, duration: 0.3, ease: "circOut" }}
      className="group"
    >
      <Link to={`/tours/${tour.id}`} className="block relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-stone-100 shadow-sm hover:shadow-2xl transition-all duration-700">
        {/* Background Image */}
        <div className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-110">
          <img
            src={tour.image}
            alt={tour.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/40 transition-colors duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-90" />
        </div>

        {/* Content Badges */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
            <span className="text-white text-[10px] font-bold tracking-[0.2em] uppercase">{tour.duration}</span>
          </div>
          <div className="bg-amber-600/90 backdrop-blur-sm px-4 py-2 rounded-2xl">
            <span className="text-white text-xs font-bold tracking-tight">{tour.price}</span>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-8 left-8 right-8 z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
          <div className="flex items-center gap-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <Users className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-white/60 text-[10px] uppercase tracking-widest font-medium">{tour.group}</span>
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
    </motion.div>
  );
};

export default function Home() {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const stats = [
    { number: "10+", label: "Лет опыта" },
    { number: "5000+", label: "Довольных туристов" },
    { number: "15", label: "Авторских маршрутов" },
    { number: "4000м", label: "Максимальная высота" },
    { number: "120+", label: "Скрытых локаций" },
    { number: "4.9/5", label: "Рейтинг туров" }
  ];

  const mobileHighlights = [
    { value: "10+", label: "лет опыта" },
    { value: "15", label: "маршрутов" },
    { value: "4.9/5", label: "рейтинг" }
  ];

  const popularTours = [
    {
      id: 1,
      title: "Кармадонское ущелье и Даргавс",
      image: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1200",
      duration: "1 день",
      group: "до 6 чел",
      price: "от 3 500 ₽"
    },
    {
      id: 2,
      title: "Цейское ущелье и Сказский ледник",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200",
      duration: "1 день",
      group: "до 8 чел",
      price: "от 4 000 ₽"
    },
    {
      id: 3,
      title: "Дигория — край тысячи водопадов",
      image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1200",
      duration: "2 дня",
      group: "до 4 чел",
      price: "от 9 000 ₽"
    }
  ];

  return (
    <div className="w-full bg-white">
      {/* Hero Section - Airy Editorial Layout */}
      <section className="relative overflow-hidden w-full pt-24 sm:pt-20 xl:h-[95vh] xl:min-h-[850px] xl:pt-0">
        <motion.div style={{ y: yHero }} className="absolute inset-0 z-0 w-full h-[140%] -top-[20%]">
          <img
            src={heroImage}
            alt="Кавказские горы"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-stone-900/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/60 via-stone-900/20 to-transparent opacity-30" />
        </motion.div>

        <div className="relative z-10 flex min-h-[auto] items-start sm:min-h-[calc(100svh-5rem)] sm:items-center xl:h-full xl:min-h-0">
            <div className="w-full max-w-[96rem] mx-auto px-5 sm:px-6 lg:px-8 xl:px-10 min-[1700px]:px-16 pt-5 pb-0 sm:py-10 lg:py-16 xl:py-20">
              <div className="grid items-center gap-10 min-[1700px]:grid-cols-[minmax(0,1fr)_28rem] min-[1700px]:gap-24">

              {/* Left Column: Main Impact */}
              <div className="grid min-w-0 min-[1700px]:pr-12">
                <div className="flex max-w-[38rem] min-w-0 flex-col rounded-[2rem] bg-black/10 px-4 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-[3px] sm:bg-transparent sm:px-0 sm:py-0 sm:shadow-none sm:backdrop-blur-0 xl:max-w-[34rem] min-[1700px]:max-w-[46rem]">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                    className="mb-4 flex items-center gap-3 sm:mb-8 sm:gap-4"
                  >
                    <div className="h-px w-7 bg-accent-500 sm:w-12"></div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-white/90 drop-shadow-md sm:text-xs sm:tracking-[0.4em]">
                      EST. 2014 • My Ossetia
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05, ease: "circOut" }}
                    className="mb-4 max-w-[9ch] font-serif text-[clamp(3.15rem,15vw,5.2rem)] leading-[0.9] tracking-tight text-white drop-shadow-2xl sm:mb-8 sm:text-[clamp(4.5rem,11vw,6rem)] sm:leading-[0.85] lg:text-[clamp(4.75rem,8vw,6.4rem)] xl:text-[clamp(5.2rem,7vw,6.9rem)] min-[1700px]:max-w-[10ch] min-[1700px]:text-[8.25rem]"
                  >
                    Открой <br />
                    <span className="italic text-accent-500">настоящий</span> <br /> Кавказ
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1, ease: "circOut" }}
                    className="mb-6 max-w-[19rem] text-[1.05rem] font-light leading-relaxed text-white/92 drop-shadow-lg sm:mb-10 sm:max-w-md sm:text-xl md:max-w-xl md:text-2xl xl:mb-14"
                  >
                    Авторские экспедиции по горной Осетии. Влюбляем в горы тех, кто видит их впервые.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.12, ease: "circOut" }}
                    className="mb-6 grid grid-cols-3 gap-2 sm:hidden"
                  >
                    {mobileHighlights.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-white/10 bg-white/8 px-3 py-3 text-white backdrop-blur-md">
                        <div className="mb-1 text-base font-semibold leading-none text-accent-400">{item.value}</div>
                        <div className="text-[9px] uppercase tracking-[0.18em] text-white/65">{item.label}</div>
                      </div>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15, ease: "circOut" }}
                    className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8 lg:gap-10"
                  >
                    <Link
                      to="/tours"
                      className="group relative inline-flex min-h-14 w-full items-center justify-between overflow-hidden rounded-[1.4rem] bg-accent-500 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-white shadow-[0_20px_50px_rgba(217,119,6,0.3)] transition-all duration-500 hover:-translate-y-1 sm:min-h-0 sm:w-auto sm:justify-center sm:rounded-none sm:px-14 sm:py-6 sm:text-sm sm:tracking-[0.3em]"
                    >
                      <span className="absolute inset-0 translate-y-full bg-accent-600 transition-transform duration-300 ease-out group-hover:translate-y-0"></span>
                      <span className="relative z-10 flex items-center gap-3">Выбрать тур <ArrowRight className="h-5 w-5" /></span>
                    </Link>

                    <Link
                      to="/about"
                      className="group inline-flex min-h-12 w-full items-center justify-between rounded-[1.15rem] border border-white/15 bg-white/8 px-4 text-[11px] font-bold uppercase tracking-[0.24em] text-white transition-all hover:border-accent-500 hover:text-accent-500 sm:min-h-0 sm:w-fit sm:justify-start sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:pb-1 sm:border-b-2 sm:border-white/40 sm:text-xs sm:tracking-[0.3em]"
                    >
                      Наша история
                    </Link>
                  </motion.div>
                </div>
              </div>

              {/* Right Column: Expanded Featured Tour */}
              <div className="hidden min-[1700px]:grid justify-items-end min-[1700px]:pl-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, x: 40 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2, ease: "circOut" }}
                  className="relative w-full max-w-[24rem] xl:max-w-[26rem] 2xl:max-w-[28rem]"
                >
                  <div className="group relative overflow-hidden rounded-[40px] border border-white/30 bg-stone-900/10 p-10 text-white shadow-[0_50px_100px_rgba(0,0,0,0.4)] backdrop-blur-3xl xl:p-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-60" />

                    <div className="relative z-10">
                      <div className="mb-10 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 rounded-full border border-accent-400/30 bg-accent-400/10 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-accent-300">
                          <Star className="h-3 w-3 fill-accent-400 text-accent-400" />
                          Бестселлер
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                          <Clock className="h-3 w-3" /> 12 часов
                        </div>
                      </div>

                      <h3 className="mb-8 font-serif text-5xl leading-tight font-bold text-white">
                        Кармадон <br />& Даргавс
                      </h3>

                      <p className="mb-10 text-lg font-light leading-relaxed text-white/80">
                        Древние некрополи, застывшее время и мощь ледников в одном самом насыщенном путешествии сезона.
                      </p>

                      <div className="mb-12 space-y-4">
                        <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-accent-400/80">На маршруте:</div>
                        <div className="flex flex-wrap gap-3">
                          {['Некрополь', 'Кармадон', 'Качели', 'Арт-объекты'].map((tag) => (
                            <span key={tag} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] uppercase italic text-white/70">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link
                        to="/tours/1"
                        className="group/btn inline-flex w-full items-center justify-between gap-4 rounded-2xl bg-white/10 px-8 py-5 text-xs font-bold uppercase tracking-[0.3em] text-white transition-all duration-300 hover:bg-accent-500"
                      >
                        Смотреть <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Stats Glass Banner - Edge-to-Edge Format */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1, ease: "circOut" }}
          className="hidden sm:block relative inset-x-0 z-20 mt-8 px-5 pb-8 sm:mt-12 sm:px-6 sm:pb-10 min-[1700px]:absolute min-[1700px]:bottom-0 min-[1700px]:mt-0 min-[1700px]:px-0 min-[1700px]:pb-0"
        >
          <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/20 bg-stone-900/20 p-6 text-white shadow-2xl backdrop-blur-3xl sm:rounded-[2.75rem] sm:bg-white/5 sm:p-8 min-[1700px]:rounded-t-[4rem] min-[1700px]:rounded-b-none min-[1700px]:border-t min-[1700px]:border-x min-[1700px]:border-b-0 min-[1700px]:p-12">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent" />
            <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-2 gap-5 px-1 sm:grid-cols-3 sm:gap-8 sm:px-2 xl:grid-cols-6 xl:gap-4 xl:divide-x xl:divide-white/10 xl:px-8">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center text-center xl:px-4">
                  <div className="mb-2 flex items-end justify-center gap-1">
                    <span className="font-serif text-3xl leading-none text-accent-400 sm:text-4xl xl:text-5xl">{stat.number.replace('+', '')}</span>
                    {stat.number.includes('+') && <span className="mb-1 font-serif text-xl text-accent-500 sm:text-2xl">+</span>}
                  </div>
                  <div className="max-w-[120px] text-[9px] font-bold leading-tight text-white/55 uppercase tracking-[0.24em] sm:text-[10px] sm:tracking-[0.3em]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* About Teaser — Stitch "Alanian Heights" Design System */}
      <section className="relative py-36 overflow-hidden" style={{ backgroundColor: '#f8f9ff' }}>
        {/* Summit Blur — декоративные размытые круги */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.08] pointer-events-none" style={{ background: 'radial-gradient(circle, #ffdcc3, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.06] pointer-events-none" style={{ background: 'radial-gradient(circle, #ffdcc3, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-20 lg:gap-32 items-center">

            {/* Left: Asymmetric Photo Composition */}
            <div className="relative">
              <div className="relative z-10 grid grid-cols-12 grid-rows-12 h-[520px] md:h-[640px]">
                {/* Main Image — Capsule Shape */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className="col-start-1 col-span-10 row-start-1 row-span-11 overflow-hidden rounded-[3rem] relative group"
                  style={{ boxShadow: '0 10px 40px rgba(18,28,40,0.04)' }}
                >
                  <img
                    src={storyImage}
                    alt="Горы и сторожевые башни Осетии"
                    className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 via-transparent to-transparent group-hover:from-transparent transition-all duration-700" />
                </motion.div>

                {/* Overlapping Portrait */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 60 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
                  className="col-start-6 col-span-7 row-start-6 row-span-7 z-20 overflow-hidden rounded-[2rem]"
                  style={{
                    border: '10px solid white',
                    boxShadow: '0 10px 40px rgba(18,28,40,0.04), -20px 20px 60px rgba(18,28,40,0.08)'
                  }}
                >
                  <img
                    src={founderImage}
                    alt="Основатель My Ossetia Tours"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Decorative thin golden outline — asymmetric offset */}
                <div
                  className="absolute -top-6 -left-6 w-[85%] h-[88%] rounded-[3.5rem] -z-10"
                  style={{ border: '1px solid rgba(217,119,6,0.15)' }}
                />
              </div>
            </div>

            {/* Right: Editorial Content */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                {/* Editorial Cap — label with accent line */}
                <div className="flex items-center gap-4 mb-10">
                  <span className="h-px w-12" style={{ backgroundColor: '#D97706' }} />
                  <span className="text-xs font-bold tracking-[0.45em] uppercase" style={{ color: '#8d4b00' }}>
                    Основано в 2014
                  </span>
                </div>

                {/* Display heading — serif + italic contrast */}
                <h2 className="font-serif mb-10 leading-[1.05]" style={{ color: '#121c28', fontSize: 'clamp(2.25rem, 5vw, 4.5rem)' }}>
                  Мы знаем горы<br />
                  <span className="italic font-light" style={{ color: '#887364' }}>как свои пять пальцев</span>
                </h2>

                <p className="text-lg font-light leading-relaxed mb-14 max-w-lg" style={{ color: '#554336' }}>
                  Наши гиды — коренные жители Осетии, влюблённые в каждый склон Кавказского хребта.
                  Мы создаём не просто туры, а глубокое погружение в аутентичную культуру через живые маршруты.
                </p>

                {/* Feature Cards — tonal layering, no borders */}
                <div className="grid gap-5 mb-14">
                  {[
                    {
                      icon: <Compass className="w-5 h-5" />,
                      title: "Авторские маршруты",
                      text: "Уникальные тропы вдали от туристического шума."
                    },
                    {
                      icon: <Users className="w-5 h-5" />,
                      title: "Мини-группы",
                      text: "Максимум внимания каждому участнику и комфорт."
                    },
                    {
                      icon: <Camera className="w-5 h-5" />,
                      title: "Эстетика в деталях",
                      text: "Тщательно отобранные точки для лучших кадров."
                    }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-start gap-5 p-5 rounded-2xl cursor-default transition-colors duration-300"
                      style={{ backgroundColor: i === 0 ? '#eef4ff' : 'transparent' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#eef4ff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = i === 0 ? '#eef4ff' : 'transparent'; }}
                    >
                      <div className="shrink-0 p-3.5 rounded-xl" style={{ backgroundColor: '#ffffff', boxShadow: '0 2px 12px rgba(18,28,40,0.04)' }}>
                        <div style={{ color: '#D97706' }}>{item.icon}</div>
                      </div>
                      <div>
                        <h4 className="font-serif text-lg mb-1" style={{ color: '#121c28' }}>{item.title}</h4>
                        <p className="text-sm font-light leading-relaxed" style={{ color: '#554336' }}>{item.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA — Golden Hour gradient on hover */}
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-5 py-3"
                >
                  <span className="text-xs font-bold tracking-[0.25em] uppercase transition-colors" style={{ color: '#121c28' }}>
                    Узнать больше о команде
                  </span>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, #8d4b00, #b15f00)',
                      boxShadow: '0 4px 20px rgba(141,75,0,0.2)'
                    }}
                  >
                    <ArrowRight className="h-4 w-4 text-white transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Popular Tours - Elegant Catalog */}
      <section className="py-36 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px w-8 bg-amber-600/40" />
                <span className="text-xs font-bold tracking-[0.4em] uppercase text-stone-400">Маршруты</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-serif text-stone-900 leading-tight">
                Популярные <br />
                <span className="italic font-light text-stone-400">направления</span>
              </h2>
            </div>
            <Link
              to="/tours"
              className="group flex flex-col items-end gap-2"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-900 transition-colors group-hover:text-amber-600">Смотреть все туры</span>
              <div className="flex items-center">
                <div className="w-24 h-px bg-stone-200 group-hover:bg-amber-600 group-hover:w-32 transition-all duration-700"></div>
                <ArrowRight className="w-3 h-3 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all duration-700" />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            {popularTours.map((tour, index) => (
              <TourCard key={tour.id} tour={tour} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section - Asymmetric Modern Design */}
      <section className="py-24 bg-[#fdfaf6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-amber-600 font-medium tracking-widest uppercase text-sm mb-4 block">Галерея</span>
              <h2 className="text-4xl md:text-5xl font-extralight text-stone-800 leading-tight">
                Атмосфера <span className="font-serif italic text-stone-500">Осетии</span>
              </h2>
            </div>
            <p className="text-stone-500 max-w-sm font-light text-lg italic">
              «В горах нет времени, есть только вечность и вы.»
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 lg:gap-8">
            {/* vertical large */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-5 h-[400px] md:h-[700px] relative overflow-hidden group rounded-3xl"
            >
              <ParallaxImage src="https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1200" alt="Масштаб гор" speed={0.05} />
              <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
              <div className="absolute bottom-10 left-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                <p className="text-white font-serif italic text-2xl">Величие хребтов</p>
              </div>
            </motion.div>

            {/* Right side group */}
            <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 lg:gap-8">
              {/* horizontal big top */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="md:col-span-2 h-[350px] relative overflow-hidden group rounded-3xl"
              >
                <ParallaxImage src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200" alt="Цейский ледник" speed={0.1} />
                <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
                <div className="absolute top-10 left-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                  <p className="text-white font-serif italic text-2xl">Ледовые вершины</p>
                </div>
              </motion.div>

              {/* small square 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="h-[318px] relative overflow-hidden group rounded-3xl"
              >
                <ParallaxImage src="https://images.unsplash.com/photo-1540390769625-2fc3f8b1d50c?q=80&w=1000" alt="Дигория" speed={0.15} />
                <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
              </motion.div>

              {/* small square 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="h-[318px] relative overflow-hidden group rounded-3xl"
              >
                <ParallaxImage src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1000" alt="Куртатинское ущелье" speed={0.08} />
                <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - The Horizon Escape */}
      <section className="relative flex flex-col overflow-hidden bg-stone-950 md:min-h-[600px] md:flex-row">
        {/* Visual Part (Right on desktop) */}
        <div className="relative order-1 min-h-[140px] sm:min-h-[220px] md:order-2 md:w-1/2 md:min-h-[400px]">
          <ParallaxImage
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000"
            alt="Закат в горах"
            speed={0.12}
          />
          {/* Transition Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/20 to-transparent z-10 hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent z-10 md:hidden" />
        </div>

        {/* Info Part (Left on desktop) */}
        <div className="relative z-20 order-2 flex items-center justify-center px-8 py-7 md:order-1 md:w-1/2 md:p-16 lg:p-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <div className="mb-4 flex items-center gap-4 sm:mb-8">
              <span className="text-amber-500 font-mono text-xs tracking-widest uppercase">42°50′21″N 44°24′15″E</span>
              <div className="h-px w-12 bg-stone-800"></div>
            </div>

            <h2 className="mb-4 text-4xl font-serif leading-[1.1] text-white sm:mb-8 md:text-6xl">
              Готовы к <span className="italic text-stone-400">незабываемому</span> путешествию?
            </h2>

            <p className="mb-6 text-lg font-light leading-relaxed text-stone-400 sm:mb-12 md:text-xl">
              Напишите нам, и мы подберем идеальный авторский маршрут, учитывая ваши пожелания и уровень подготовки.
              <span className="block mt-4 text-stone-500 italic">— Ваш гид, Тимур</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/79000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-amber-600 text-white rounded-full font-medium hover:bg-amber-700 transition-all duration-300 group"
              >
                <Phone className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                WhatsApp
              </a>
              <a
                href="https://t.me/yourid"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-stone-800 text-white rounded-full font-medium hover:bg-stone-700 border border-stone-700 transition-all duration-300 group"
              >
                <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Telegram
              </a>
            </div>

            <div className="mt-6 flex items-center gap-6 border-t border-stone-900 pt-6 sm:mt-12 sm:pt-12">
              <p className="text-stone-600 text-sm uppercase tracking-widest font-medium">Бесплатная консультация</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
