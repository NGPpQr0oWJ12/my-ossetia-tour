import { motion, AnimatePresence } from "motion/react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Footprints, ShieldAlert, HeartHandshake, HeartPulse, Waves, IdCard, Clock, Mountain, Users, Calendar, MapPin, X } from "lucide-react";
import { useState } from "react";

export default function TourDetail() {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for the timeline
  const timeline = [
    {
      title: "АЛАНСКИЙ ЖЕНСКИЙ МОНАСТЫРЬ",
      desc: "Аланский женский монастырь — святое место в сердце Алагирского ущелья. Основан на земле древней Алании, где зародилось христианство на Кавказе. Среди гор и елей здесь царят тишина, молитва и особая духовная сила.",
      image: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1000"
    },
    {
      title: "ПАМЯТНИК УАСТЫРДЖИ",
      desc: "Величественный монумент, вырывающийся прямо из скалы. Уастырджи — покровитель мужчин, путников и воинов в осетинском эпосе. Одно из самых впечатляющих зрелищ на Транскаме.",
      image: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1000"
    },
    {
      title: "ЦЕЙСКОЕ УЩЕЛЬЕ",
      desc: "Насладитесь активным отдыхом на курорте Цей. Подъем по канатной дороге к Сказскому леднику, потрясающие виды на заснеженные вершины и кристально чистый горный воздух.",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000"
    },
    {
      title: "ТЕРМАЛЬНЫЕ ИСТОЧНИКИ БИРАГЗАНГ",
      desc: "Завершите день в тёплых целебных источниках Бирагзанг — почувствуйте гармонию с природой и силу осетинских гор! Отличное расслабление после насыщенного дня.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000"
    }
  ];

  const infoCards = [
    {
      icon: <Footprints className="h-6 w-6" />,
      title: "Форма одежды",
      desc: "Берите удобную обувь и одежду по погоде — в горах может быть прохладно."
    },
    {
      icon: <ShieldAlert className="h-6 w-6" />,
      title: "Безопасность",
      desc: "Соблюдайте правила безопасности на склонах и у водоёмов, прислушивайтесь к советам гида."
    },
    {
      icon: <HeartHandshake className="h-6 w-6" />,
      title: "Уважение",
      desc: "Уважайте местные традиции и религиозные объекты."
    },
    {
      icon: <HeartPulse className="h-6 w-6" />,
      title: "Здоровье",
      desc: "Горячие источники и сероводородные источники имеют лечебные свойства, но противопоказаны при серьёзных заболеваниях."
    },
    {
      icon: <Waves className="h-6 w-6" />,
      title: "Купание",
      desc: "При купании в горячих источниках необходимо взять с собой вещи для купания и средства личной гигиены. (Полотенца, тапочки и т.д.)"
    },
    {
      icon: <IdCard className="h-6 w-6" />,
      title: "Необходимые документы",
      desc: "Паспорт гражданина РФ или загранпаспорт"
    }
  ];

  return (
    <div className="pt-24 bg-stone-50">
      {/* Hero / Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <Link to="/tours" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Назад к турам
        </Link>
        
        <div className="relative h-[50vh] min-h-[400px] rounded-3xl overflow-hidden mb-8">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000" 
            alt="Цейское ущелье" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-stone-900/40" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12">
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">Цейское ущелье и источники</h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl">
              Откройте для себя величие гор Осетии: древние монастыри, памятники и арт-объекты, прозрачные водохранилища и захватывающие виды с горных вершин.
            </p>
          </div>
        </div>

        {/* Tour Info Bar */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8 flex-grow w-full">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-stone-500 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider font-medium">Длительность</span>
              </div>
              <span className="text-stone-900 font-medium">1 день</span>
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
              <span className="text-stone-900 font-medium">До 6 человек</span>
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
                <span className="text-xs uppercase tracking-wider font-medium">Отправление</span>
              </div>
              <span className="text-stone-900 font-medium">Владикавказ</span>
            </div>
          </div>

          <div className="w-full lg:w-auto flex-shrink-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-stone-100">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group btn-primary lg:w-auto"
            >
              <span className="relative z-10 flex items-center gap-4">Записаться на тур</span>
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Subtle mountain background */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=2000")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-6">Что вас ждет?</h2>
            <p className="text-stone-600 max-w-3xl mx-auto leading-relaxed">
              Откройте для себя величие гор Осетии: древние монастыри, памятники и арт-объекты, прозрачные водохранилища и захватывающие виды с горных вершин. Насладитесь активным отдыхом на курорте Цей и завершите день в тёплых целебных источниках Бирагзанг — почувствуйте гармонию с природой и силу осетинских гор!
            </p>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-stone-300 md:-translate-x-1/2"></div>

            {timeline.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={index}
                  className={`relative flex items-center justify-between md:justify-normal mb-12 ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}
                >
                  {/* Circle */}
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-stone-200 rounded-full border-4 border-stone-50 transform -translate-x-1/2 flex items-center justify-center text-xs font-bold text-stone-500 z-10">
                    {index + 1}
                  </div>
                  
                  {/* Content */}
                  <div className={`w-full pl-12 md:pl-0 md:w-[calc(50%-3rem)] ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
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

      {/* Important Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 text-center mb-16">Важная информация</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {infoCards.map((card, index) => (
              <div 
                key={index}
                className="bg-stone-100 p-8 rounded-2xl"
              >
                <div className="text-stone-700 mb-4">
                  {card.icon}
                </div>
                <h3 className="mb-3">{card.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          <div
            className="bg-stone-50 p-6 rounded-2xl border border-stone-200 text-stone-800 text-sm leading-relaxed"
          >
            <span className="font-bold">Рекомендуем взять с собой:</span> Наличные средства, если планируете обедать или покупать сувениры по маршруту. Так как в горах не везде используют безналичный способ оплаты.
          </div>
        </div>
      </section>

    <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-stone-900 border border-white/10 p-8 shadow-2xl lg:p-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 lg:top-8 lg:right-8 text-white/50 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="mb-8 text-center font-serif text-3xl leading-[1.1] text-white">Оставить заявку</h3>

              <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="modal-name" className="mb-2 block text-[10px] font-bold tracking-widest text-white/50 uppercase">Ваше имя</label>
                    <input
                      type="text"
                      id="modal-name"
                      className="w-full border-b border-white/20 bg-transparent px-0 py-2 text-base text-white placeholder-white/30 transition-colors focus:border-accent-500 focus:outline-none"
                      placeholder="Иван Иванов"
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-phone" className="mb-2 block text-[10px] font-bold tracking-widest text-white/50 uppercase">Телефон</label>
                    <input
                      type="tel"
                      id="modal-phone"
                      className="w-full border-b border-white/20 bg-transparent px-0 py-2 text-base text-white placeholder-white/30 transition-colors focus:border-accent-500 focus:outline-none"
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="modal-message" className="mb-2 block text-[10px] font-bold tracking-widest text-white/50 uppercase">Комментарий к заявке</label>
                  <textarea
                    id="modal-message"
                    rows={2}
                    className="w-full border-b border-white/20 bg-transparent px-0 py-2 text-base text-white placeholder-white/30 transition-colors focus:border-accent-500 focus:outline-none resize-none"
                    placeholder="Расскажите о ваших пожеланиях..."
                  ></textarea>
                </div>

                <div className="mt-4">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
