import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, Compass, Camera, Calendar, Users, Star, Send, Clock } from "lucide-react";
import { Link } from "react-router-dom";
const heroImage = "/12476587.jpg";
const founderImage = "/gid.png";
const storyImage = "/onas.webp";

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

const TourCard = ({ tour, index }: any) => {
  return (
    <div className="group">
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
    </div>
  );
};

export default function Home() {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

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
      <section className="relative overflow-hidden w-full flex flex-col items-center pt-24 pb-8 sm:pt-32 sm:pb-16">
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

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col justify-center py-8 md:py-12">
          {/* Main Content Grid */}
          <div className="w-full grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 items-center">
            {/* Left Column: Main Impact */}
            <div className="grid min-w-0">
              <div className="flex flex-col">
                <h1 className="mb-8 font-serif text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95] text-white drop-shadow-2xl sm:mb-10 sm:leading-[0.9] xl:mb-12 xl:text-[clamp(4.5rem,6vw,6.5rem)]">
                  Открой <br />
                  <span className="text-accent-500">настоящую</span> <br /> Аланию
                </h1>

                <p className="mb-12 max-w-2xl text-[1rem] font-light leading-relaxed text-white/92 drop-shadow-lg sm:mb-12 sm:text-xl lg:text-2xl xl:mb-12 xl:text-3xl">
                  Авторские экспедиции по горной Осетии. Влюбляем в горы тех, кто видит их впервые.
                </p>

                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <Link
                    to="/tours"
                    className="group btn-glass sm:w-[26rem] xl:w-[28rem] min-[1700px]:w-[32rem] min-[1700px]:min-h-[5.5rem] min-[1700px]:text-base"
                  >
                    <span className="relative z-10 flex items-center gap-4">Выбрать тур <ArrowRight className="h-5 w-5" /></span>
                  </Link>
                </div>

                <div className="hidden">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-accent-400/30 bg-accent-400/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em] text-accent-300">
                      <Star className="h-3 w-3 fill-accent-400 text-accent-400" />
                      Популярный маршрут
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
                      <Clock className="h-3 w-3" /> 12 часов
                    </div>
                  </div>

                  <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
                    <div>
                      <h3 className="mb-3 font-serif text-3xl font-bold leading-[1.05] text-white xl:text-[2.6rem]">
                        Кармадон &amp; Даргавс
                      </h3>
                      <p className="max-w-2xl text-base font-light leading-relaxed text-white/78">
                        Древние некрополи, застывшее время и мощь ледников в одном самом насыщенном путешествии сезона.
                      </p>
                    </div>

                    <Link
                      to="/tours/1"
                      className="group/compact inline-flex min-h-12 items-center justify-between gap-4 rounded-2xl bg-white/10 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:bg-accent-500 xl:min-w-[15rem]"
                    >
                      Смотреть
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/compact:translate-x-1" />
                    </Link>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {['Некрополь', 'Кармадон', 'Качели', 'Арт-объекты'].map((tag) => (
                      <span key={tag} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] uppercase text-white/70">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Featured Tour Card */}
            <div className="hidden lg:grid justify-items-end self-end">
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
                        <Clock className="h-3 w-3" /> 12 часов
                      </div>
                    </div>

                    <h3 className="mb-3 font-serif text-[2.5rem] font-bold leading-[0.98] text-white xl:text-[2.75rem] 2xl:text-[3rem] min-[1700px]:mb-6 min-[1700px]:text-5xl">
                      Кармадон <br />& Даргавс
                    </h3>

                    <p className="mb-4 text-sm font-light leading-relaxed text-white/80 2xl:text-base min-[1700px]:mb-8 min-[1700px]:text-lg">
                      Древние некрополи, застывшее время и мощь ледников в одном самом насыщенном путешествии сезона.
                    </p>

                    <div className="mb-5 space-y-3 min-[1700px]:mb-10 min-[1700px]:space-y-4">
                      <div className="mb-1 text-[9px] font-bold uppercase tracking-[0.26em] text-accent-400/80 min-[1700px]:mb-3 min-[1700px]:text-[10px] min-[1700px]:tracking-[0.3em]">На маршруте:</div>
                      <div className="flex flex-wrap gap-2.5 min-[1700px]:gap-3">
                        {['Некрополь', 'Кармадон', 'Качели', 'Арт-объекты'].map((tag) => (
                          <span key={tag} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] uppercase text-white/70 min-[1700px]:px-3 min-[1700px]:text-[11px]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Link
                        to="/tours/1"
                        className="group btn-sm group/btn w-full justify-between gap-4 px-6 py-4 text-[11px] min-[1700px]:px-8 min-[1700px]:py-5 min-[1700px]:text-xs"
                      >
                        Смотреть <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
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
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 leading-tight">
                Популярные <br />
                <span className="font-light text-stone-400">направления</span>
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
                <div
                  className="col-start-1 col-span-10 row-start-1 row-span-11 overflow-hidden rounded-[3rem] relative group"
                  style={{ boxShadow: '0 10px 40px rgba(18,28,40,0.04)' }}
                >
                  <img
                    src={storyImage}
                    alt="Горы и сторожевые башни Осетии"
                    className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 via-transparent to-transparent group-hover:from-transparent transition-all duration-700" />
                </div>

                {/* Overlapping Portrait */}
                <div
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
                </div>

                {/* Decorative thin golden outline — asymmetric offset */}
                <div
                  className="absolute -top-6 -left-6 w-[85%] h-[88%] rounded-[3.5rem] -z-10"
                  style={{ border: '1px solid rgba(217,119,6,0.15)' }}
                />
              </div>
            </div>

            {/* Right: Editorial Content */}
            <div className="relative">
              <div>
                {/* Editorial Cap — label with accent line */}
                <div className="flex items-center gap-4 mb-10">
                  <span className="h-px w-12" style={{ backgroundColor: '#D97706' }} />
                  <span className="text-xs font-bold tracking-[0.45em] uppercase" style={{ color: '#8d4b00' }}>
                    Основано в 2014
                  </span>
                </div>

                <h2 className="mb-10 leading-[1.05] text-4xl md:text-5xl lg:text-6xl text-[#121c28]">
                  Мы знаем горы<br />
                  <span className="text-[#887364]">как свои пять пальцев</span>
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
                        <h4 className="text-lg mb-1" style={{ color: '#121c28' }}>{item.title}</h4>
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
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Guide Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl mb-12">Ваш гид</h2>
          
          <div
            className="mb-8 inline-block"
          >
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
              <img 
                src={founderImage} 
                alt="Гид Тимур" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div
            className="space-y-6 text-stone-700 leading-relaxed text-left md:text-center"
          >
            <p>
              Меня зовут Тимур. Я родился и вырос в Северной Осетии, с самого детства люблю нашу природу и горы. Вот уже более пяти лет я провожу экскурсии по этим удивительным местам, показывая туристам красоту ущелий, величие гор, старинные монастыри и уникальные арт-объекты. Для меня каждая поездка — это возможность поделиться любовью к родной земле и показать её с самой яркой, незабываемой стороны.
            </p>
            <p>
              По окончанию экскурсии мы дарим каждому гостю небольшой набор сувениров от нашего магазина My Ossetia Store.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section - The Horizon Escape */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParallaxImage
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000"
            alt="Закат в горах"
            speed={0.12}
          />
          {/* Frosted Glass Overlay */}
          <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-md" />
        </div>

        <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-col px-6 py-12 lg:px-8 xl:py-24">
          <div className="grid grid-cols-1 items-stretch gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">

            {/* LEFT Info */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center gap-4 sm:mb-8">
                  <span className="font-mono text-xs font-bold tracking-widest text-amber-400 drop-shadow-md uppercase">42°50′21″N 44°24′15″E</span>
                  <div className="h-px w-12 bg-white/40 drop-shadow-md"></div>
                </div>

                <h2 className="mb-6 font-serif text-4xl leading-[1.05] text-white drop-shadow-md md:text-5xl lg:text-6xl">
                  Готовы к <span className="text-white">незабываемому</span> путешествию?
                </h2>

                <p className="mb-10 text-lg font-medium leading-relaxed text-white drop-shadow-md lg:text-xl">
                  Напишите нам, и мы подберем идеальный авторский маршрут, учитывая ваши пожелания и уровень подготовки.
                  <span className="mt-4 block font-serif text-white/90 drop-shadow-sm">— Ваш гид, Тимур</span>
                </p>
              </div>

              {/* Big Buttons */}
              <div className="mt-auto flex flex-col gap-4 sm:flex-row">
                <a
                  href="https://wa.me/79000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group btn-primary !bg-[#25D366] hover:!bg-[#20bd5a] shadow-[0_0_30px_rgba(37,211,102,0.25)]"
                >
                  <WhatsAppIcon className="mr-3 h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  WhatsApp
                </a>
                <a
                  href="https://t.me/yourid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group btn-glass !border-stone-700/50 !bg-white/5 hover:!bg-white/10"
                >
                  <Send className="mr-3 h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  Telegram
                </a>
              </div>
            </div>

            {/* RIGHT Form Container - Liquid Glass */}
            <div className="flex w-full flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white/20 bg-stone-900/40 p-8 shadow-[0_40px_80px_rgba(0,0,0,0.5)] backdrop-blur-3xl md:ml-auto lg:p-10">
              <h3 className="mb-8 text-center text-3xl leading-[1.1] text-white">Оставить заявку</h3>

              <form className="flex h-full flex-col justify-between" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-[10px] font-bold tracking-widest text-white/50 uppercase">Ваше имя</label>
                      <input
                        type="text"
                        id="name"
                        className="w-full border-b border-white/20 bg-transparent px-0 py-2 text-base text-white placeholder-white/30 transition-colors focus:border-accent-500 focus:outline-none"
                        placeholder="Иван Иванов"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="mb-2 block text-[10px] font-bold tracking-widest text-white/50 uppercase">Телефон</label>
                      <input
                        type="tel"
                        id="phone"
                        className="w-full border-b border-white/20 bg-transparent px-0 py-2 text-base text-white placeholder-white/30 transition-colors focus:border-accent-500 focus:outline-none"
                        placeholder="+7 (___) ___-__-__"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="tour" className="mb-2 block text-[10px] font-bold tracking-widest text-white/50 uppercase">Интересующий тур</label>
                    <select
                      id="tour"
                      className="w-full appearance-none border-b border-white/20 bg-transparent px-0 py-2 text-base text-white transition-colors focus:border-accent-500 focus:outline-none [&>option]:bg-stone-900"
                    >
                      <option value="">Выберите тур из списка</option>
                      <option value="karmadon">Кармадонское ущелье и Даргавс</option>
                      <option value="tsey">Цейское ущелье</option>
                      <option value="digoria">Дигория</option>
                      <option value="kurtat">Куртатинское ущелье</option>
                      <option value="other">Индивидуальный маршрут</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-[10px] font-bold tracking-widest text-white/50 uppercase">Комментарий к заявке</label>
                    <textarea
                      id="message"
                      rows={2}
                      className="w-full border-b border-white/20 bg-transparent px-0 py-2 text-base text-white placeholder-white/30 transition-colors focus:border-accent-500 focus:outline-none resize-none"
                      placeholder="Расскажите о ваших пожеланиях..."
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="group btn-primary w-full"
                  >
                    Отправить
                  </button>
                  <p className="mt-4 text-center text-[9px] leading-relaxed tracking-wider text-white/40 uppercase">
                    Нажимая кнопку, вы соглашаетесь с<br /> политикой обработки данных.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section >
    </div >
  );
}
