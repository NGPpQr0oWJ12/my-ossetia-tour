import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Map, Compass, Camera, Calendar, Users, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const stats = [
    { number: "10+", label: "Лет опыта" },
    { number: "5000+", label: "Довольных туристов" },
    { number: "15", label: "Авторских маршрутов" },
    { number: "4000м", label: "Максимальная высота" }
  ];

  const popularTours = [
    {
      id: 1,
      title: "Кармадонское ущелье и Даргавс",
      image: "https://images.unsplash.com/photo-1588258219511-649ea9cb8184?q=80&w=1000&auto=format&fit=crop",
      duration: "1 день",
      group: "до 6 чел",
      price: "от 3 500 ₽"
    },
    {
      id: 2,
      title: "Цейское ущелье и Сказский ледник",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
      duration: "1 день",
      group: "до 8 чел",
      price: "от 4 000 ₽"
    },
    {
      id: 3,
      title: "Дигория — край тысячи водопадов",
      image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1000&auto=format&fit=crop",
      duration: "2 дня",
      group: "до 4 чел",
      price: "от 9 000 ₽"
    }
  ];

  return (
    <div className="w-full bg-white">
      {/* Hero Section - Full Width Parallax */}
      <section className="relative h-[75vh] min-h-[600px] flex items-center overflow-hidden w-full">
        <motion.div style={{ y }} className="absolute inset-0 z-0 w-full h-[140%] -top-[20%]">
          <img
            src="https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=2000&auto=format&fit=crop"
            alt="Кавказские горы"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-stone-900/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent opacity-60" />
        </motion.div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-px bg-accent-500"></div>
              <span className="text-white font-sans tracking-[0.3em] uppercase text-sm font-medium">
                My Ossetia Tours
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-[1.1]"
            >
              Откройте для себя <br />
              <span className="italic text-accent-500">настоящий Кавказ</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white/90 text-lg md:text-xl max-w-2xl mb-12 font-light leading-relaxed drop-shadow-sm"
            >
              Авторские туры по Северной Осетии от местных жителей. Погрузитесь в культуру, историю и невероятную природу гор.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center gap-6"
            >
              <Link
                to="/tours"
                className="group relative inline-flex items-center justify-center px-10 py-4 text-sm font-medium tracking-widest uppercase overflow-hidden bg-accent-500 text-white hover:text-white transition-colors duration-300 shadow-lg"
              >
                <span className="absolute inset-0 bg-accent-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                <span className="relative z-10 flex items-center gap-2">Выбрать тур <ArrowRight className="h-4 w-4" /></span>
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-white hover:text-accent-500 transition-colors border-b border-white hover:border-accent-500 pb-1"
              >
                О компании
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating Info Card - Desktop Only */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-12 right-12 hidden lg:block z-20"
        >
          <div className="relative w-80 overflow-hidden rounded-[28px] border border-white/20 bg-white/6 p-7 text-white shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/16 via-white/7 to-white/3" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/28 via-stone-950/10 to-white/6" />
            <div className="absolute inset-x-0 top-0 h-px bg-white/32" />

            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-300/35 bg-white/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.28em] uppercase text-accent-200">
                <Star className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
                Хит продаж
              </div>

              <h3 className="font-serif text-[2rem] leading-tight text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.22)]">
                Кармадон и Даргавс
              </h3>

              <p className="mt-3 max-w-[18rem] text-[1.02rem] leading-7 text-white/90">
                Самый популярный однодневный маршрут по главным ущельям.
              </p>

              <Link
                to="/tours/1"
                className="mt-6 inline-flex items-center border-b border-accent-400/70 pb-1 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:text-accent-300"
              >
                Смотреть программу
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Banner */}
      <section className="bg-stone-900 text-white py-16 relative z-20 -mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-white/10">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center px-4"
              >
                <div className="text-4xl md:text-5xl font-serif text-accent-500 mb-2">{stat.number}</div>
                <div className="text-sm text-stone-400 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Teaser - Complex Layout */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

            {/* Left: Images */}
            <div className="w-full lg:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-4/5 aspect-[3/4] rounded-t-full overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1513026705653-f724a434b92b?q=80&w=1000&auto=format&fit=crop"
                  alt="Горы Осетии"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute -bottom-10 right-0 z-20 w-3/5 aspect-square border-8 border-white shadow-2xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=800&auto=format&fit=crop"
                  alt="Наш гид"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Decorative Outline */}
              <div className="absolute top-8 -left-8 w-4/5 aspect-[3/4] rounded-t-full border border-accent-500/30 -z-10"></div>
            </div>

            {/* Right: Text */}
            <div className="w-full lg:w-1/2 mt-16 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-accent-500 tracking-widest uppercase text-sm font-medium mb-4 block">О нас</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8 text-stone-900 leading-tight">
                  Мы знаем горы <br /><span className="italic text-stone-500">как свои пять пальцев</span>
                </h2>
                <p className="text-stone-600 text-lg font-light leading-relaxed mb-8">
                  My Ossetia Tours — это не просто туристическое агентство. Это команда местных жителей, которые родились и выросли среди этих величественных вершин. Мы хотим показать вам Кавказ таким, каким видим его мы — диким, прекрасным и гостеприимным.
                </p>

                <ul className="space-y-4 mb-10">
                  {[
                    { icon: <Compass className="w-5 h-5 text-accent-500" />, text: "Авторские маршруты вдали от толп туристов" },
                    { icon: <Users className="w-5 h-5 text-accent-500" />, text: "Мини-группы для максимального комфорта" },
                    { icon: <Camera className="w-5 h-5 text-accent-500" />, text: "Самые фотогеничные и секретные локации" }
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-stone-800">
                      <div className="bg-stone-50 p-3 rounded-full">{item.icon}</div>
                      <span className="font-medium">{item.text}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-stone-900 hover:text-accent-500 transition-colors pb-2 border-b border-stone-900 hover:border-accent-500"
                >
                  Узнать больше о команде <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Popular Tours - Elegant Cards */}
      <section className="py-32 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-accent-500 tracking-widest uppercase text-sm font-medium mb-4 block">Маршруты</span>
              <h2 className="text-4xl md:text-5xl font-serif mb-6 text-stone-900">Популярные направления</h2>
              <div className="w-12 h-px bg-accent-500 mb-6"></div>
            </div>
            <Link to="/tours" className="hidden md:inline-flex items-center justify-center px-8 py-4 text-sm font-medium tracking-widest uppercase border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-colors duration-300">
              Смотреть все туры
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularTours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={`/tours/${tour.id}`} className="block group relative h-[500px] overflow-hidden bg-stone-900">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-80 opacity-60"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />

                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="flex gap-4 text-white/80 text-sm mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-accent-500" /> {tour.duration}</span>
                      <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-accent-500" /> {tour.group}</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-serif text-white mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                      {tour.title}
                    </h3>

                    <div className="flex items-center justify-between transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-150">
                      <p className="text-accent-500 font-medium text-lg">{tour.price}</p>
                      <span className="text-white text-sm uppercase tracking-widest border-b border-accent-500 pb-1">
                        Программа
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link to="/tours" className="inline-flex items-center justify-center px-8 py-4 w-full text-sm font-medium tracking-widest uppercase border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-colors duration-300">
              Смотреть все туры
            </Link>
          </div>
        </div>
      </section>

      {/* Photo Gallery - Masonry Layout */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent-500 tracking-widest uppercase text-sm font-medium mb-4 block">Галерея</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-stone-900">Атмосфера Кавказа</h2>
            <div className="w-12 h-px bg-accent-500 mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="col-span-2 row-span-2 overflow-hidden relative group"
            >
              <img src="https://images.unsplash.com/photo-1527482797697-8795b05a13fe?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Горы" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-transparent transition-colors duration-500"></div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="col-span-1 row-span-1 overflow-hidden relative group"
            >
              <img src="https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Природа" referrerPolicy="no-referrer" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="col-span-1 row-span-2 overflow-hidden relative group"
            >
              <img src="https://images.unsplash.com/photo-1588258219511-649ea9cb8184?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Ущелье" referrerPolicy="no-referrer" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="col-span-1 row-span-1 overflow-hidden relative group"
            >
              <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Ледник" referrerPolicy="no-referrer" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=2000&auto=format&fit=crop"
            alt="Горы"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-stone-900/70" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-8">Готовы к незабываемому путешествию?</h2>
          <div className="w-12 h-px bg-accent-500 mx-auto mb-8"></div>
          <p className="text-lg text-stone-300 mb-12 font-light">
            Оставьте заявку, и мы свяжемся с вами, чтобы подобрать идеальный маршрут для вашего отдыха на Кавказе.
          </p>
          <Link
            to="/contacts"
            className="group relative inline-flex items-center justify-center px-10 py-5 text-sm font-medium tracking-widest uppercase overflow-hidden bg-accent-500 text-white hover:text-white transition-colors duration-300"
          >
            <span className="absolute inset-0 bg-accent-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
            <span className="relative z-10">Связаться с нами</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
