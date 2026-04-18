import { motion } from "motion/react";
const guideImage = "/gid.png";

export default function About() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span
            className="block text-accent-500 font-sans tracking-widest uppercase text-sm mb-4"
          >
            О компании
          </span>
          <h1
            className="text-4xl md:text-6xl font-serif text-stone-900 mb-6"
          >
            Мы открываем <span className="font-light text-stone-500">настоящий Кавказ</span>
          </h1>
          <p
            className="text-xl text-stone-600 leading-relaxed"
          >
            My Ossetia Travel — это команда местных жителей, влюбленных в свои горы. Мы не просто возим туристов по достопримечательностям, мы погружаем вас в культуру, историю и природу Северной Осетии.
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div
            className="h-[500px] rounded-2xl overflow-hidden"
          >
            <img
              src={guideImage}
              alt="Гид в горах"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col gap-8">
            <div
              className="h-[234px] rounded-2xl overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1000&auto=format&fit=crop"
                alt="Природа Осетии"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div
              className="h-[234px] rounded-2xl overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop"
                alt="Горы Кавказа"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div
          >
            <h3 className="text-2xl font-serif mb-4">Наша миссия</h3>
            <p className="text-stone-600 leading-relaxed">
              Показать красоту Северной Осетии так, чтобы каждый гость захотел вернуться. Мы стремимся развивать экологичный и ответственный туризм, сохраняя природу и уважая местные традиции.
            </p>
          </div>
          <div
          >
            <h3 className="text-2xl font-serif mb-4">Безопасность</h3>
            <p className="text-stone-600 leading-relaxed">
              Горы не терпят легкомыслия. Все наши маршруты проверены, автомобили проходят регулярное ТО, а гиды имеют сертификаты оказания первой помощи и огромный опыт работы в горной местности.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
