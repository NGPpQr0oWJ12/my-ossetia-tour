import { motion } from "motion/react";
import { Clock, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function Tours() {
  const tours = [
    {
      id: 1,
      title: "Кармадонское ущелье и Даргавс",
      description: "Путешествие по местам силы. Вы увидите печально известное Кармадонское ущелье, древний некрополь Даргавс («Город мертвых») и Мидаграбинские водопады.",
      image: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1200",
      duration: "1 день",
      groupSize: "до 6 человек",
      location: "Северная Осетия",
      price: "от 3 500 ₽"
    },
    {
      id: 2,
      title: "Цейское ущелье и Сказский ледник",
      description: "Жемчужина Северной Осетии. Подъем по канатной дороге к Сказскому леднику, посещение святилища Реком и купание в термальных источниках Бирагзанг.",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200",
      duration: "1 день",
      groupSize: "до 6 человек",
      location: "Северная Осетия",
      price: "от 4 000 ₽"
    },
    {
      id: 3,
      title: "Дигория — край тысячи водопадов",
      description: "Двухдневное погружение в самую отдаленную и живописную часть республики. Национальный парк Алания, древние башни, водопады Три сестры и ледник Караугом.",
      image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1200",
      duration: "2 дня",
      groupSize: "до 4 человек",
      location: "Нац. парк Алания",
      price: "от 9 000 ₽"
    },
    {
      id: 4,
      title: "Куртатинское ущелье",
      description: "Самый популярный маршрут. Кадаргаванский каньон, скальная крепость Дзивгис, самый высокогорный монастырь в России и качели над пропастью.",
      image: "https://images.unsplash.com/photo-1540390769625-2fc3f8b1d50c?q=80&w=1200",
      duration: "1 день",
      groupSize: "до 6 человек",
      location: "Северная Осетия",
      price: "от 3 500 ₽"
    },
    {
      id: 5,
      title: "Горная Ингушетия",
      description: "Путешествие в соседнюю республику. Страна башен: величественные комплексы Вовнушки, Эгикал, Таргим и древнейший христианский храм Тхаба-Ерды.",
      image: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1200",
      duration: "1 день",
      groupSize: "до 4 человек",
      location: "Ингушетия",
      price: "от 4 500 ₽"
    },
    {
      id: 6,
      title: "Джип-тур на плато Бермамыт",
      description: "Встреча рассвета с лучшим видом на Эльбрус. Экстремальный подъем на внедорожниках, невероятные пейзажи и горячий кофе на краю пропасти.",
      image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200",
      duration: "1 день",
      groupSize: "до 4 человек",
      location: "КЧР",
      price: "от 5 000 ₽"
    }
  ];

  return (
    <div className="pt-32 pb-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1
            className="text-4xl md:text-6xl mb-6"
          >
            Наши <span className="text-stone-500">маршруты</span>
          </h1>
          <p
            className="text-xl text-stone-600"
          >
            Выберите свое идеальное приключение в горах Кавказа
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {tours.map((tour, index) => (
            <div 
              key={tour.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-100 flex flex-col sm:flex-row"
            >
              <div className="sm:w-2/5 h-64 sm:h-auto relative">
                <img 
                  src={tour.image} 
                  alt={tour.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8 sm:w-3/5 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl mb-3">{tour.title}</h3>
                  <p className="text-stone-600 mb-6 text-sm leading-relaxed line-clamp-3">
                    {tour.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-stone-500 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-500 text-sm">
                      <Users className="h-4 w-4" />
                      <span>{tour.groupSize}</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-500 text-sm col-span-2">
                      <MapPin className="h-4 w-4" />
                      <span>{tour.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
                  <span className="text-lg font-medium text-stone-900">{tour.price}</span>
                  <Link to={`/tours/${tour.id}`} className="btn-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Подробнее
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
