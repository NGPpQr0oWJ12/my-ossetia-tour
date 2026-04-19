import { Clock, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { publicApi } from "../lib/api";
import type { Tour } from "../lib/types";

type CardTour = {
  id: number;
  title: string;
  description: string;
  image: string;
  duration: string;
  groupSize: string;
  location: string;
  price: string;
};

const FALLBACK_TOURS: CardTour[] = [];

export default function Tours() {
  const [tours, setTours] = useState<CardTour[]>(FALLBACK_TOURS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const data = await publicApi.getTours();
        if (data.length > 0) {
          setTours(
            data.map((tour: Tour) => ({
              id: tour.id,
              title: tour.title,
              description: tour.short_description || tour.full_description,
              image: tour.cover_image_url,
              duration: tour.duration,
              groupSize: tour.group_size,
              location: tour.location,
              price: tour.price_from,
            })),
          );
        }
      } catch {
        // fallback content stays visible
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="pt-32 pb-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl mb-6">
            Наши <span className="text-stone-500">маршруты</span>
          </h1>
          <p className="text-xl text-stone-600">
            Выберите свое идеальное приключение в горах Кавказа
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {tours.map((tour) => (
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
                  <Link to={`/tours/${tour.id}`} className="btn-primary py-3 px-6 text-[10px]">
                    Подробнее
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
