import { motion } from "motion/react";

export default function About() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="block text-accent-500 font-sans tracking-widest uppercase text-sm mb-4"
          >
            О компании
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif text-stone-900 mb-6"
          >
            Мы открываем <span className="italic">настоящий Кавказ</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-stone-600 leading-relaxed"
          >
            My Ossetia Tours — это команда местных жителей, влюбленных в свои горы. Мы не просто возим туристов по достопримечательностям, мы погружаем вас в культуру, историю и природу Северной Осетии.
          </motion.p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="h-[500px] rounded-2xl overflow-hidden"
          >
            <img 
              src="/gid.png" 
              alt="Гид в горах" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="flex flex-col gap-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="h-[234px] rounded-2xl overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1000&auto=format&fit=crop" 
                alt="Природа Осетии" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="h-[234px] rounded-2xl overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop" 
                alt="Горы Кавказа" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>

        {/* Text Content */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-serif mb-4">Наша миссия</h3>
            <p className="text-stone-600 leading-relaxed">
              Показать красоту Северной Осетии так, чтобы каждый гость захотел вернуться. Мы стремимся развивать экологичный и ответственный туризм, сохраняя природу и уважая местные традиции.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-2xl font-serif mb-4">Безопасность</h3>
            <p className="text-stone-600 leading-relaxed">
              Горы не терпят легкомыслия. Все наши маршруты проверены, автомобили проходят регулярное ТО, а гиды имеют сертификаты оказания первой помощи и огромный опыт работы в горной местности.
            </p>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
