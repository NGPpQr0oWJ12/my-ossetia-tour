import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contacts() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1
            className="text-4xl md:text-6xl font-serif text-stone-900 mb-6"
          >
            Свяжитесь с <span className="font-light text-stone-500">нами</span>
          </h1>
          <p
            className="text-xl text-stone-600"
          >
            Мы готовы ответить на любые вопросы и организовать тур вашей мечты
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div
            className="bg-stone-50 p-10 rounded-3xl"
          >
            <h3 className="text-2xl font-serif mb-8">Контактная информация</h3>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm text-forest-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-stone-900 mb-1">Офис</h4>
                  <p className="text-stone-600">г. Владикавказ, пр. Мира, 1<br/>Республика Северная Осетия-Алания</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm text-forest-600">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-stone-900 mb-1">Телефон</h4>
                  <p className="text-stone-600">+7 (999) 123-45-67<br/>+7 (999) 765-43-21</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm text-forest-600">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-stone-900 mb-1">Email</h4>
                  <p className="text-stone-600">info@alaniatours.ru<br/>booking@alaniatours.ru</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm text-forest-600">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-stone-900 mb-1">Режим работы</h4>
                  <p className="text-stone-600">Ежедневно: 09:00 – 20:00<br/>Без выходных</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
          >
            <h3 className="text-2xl font-serif mb-8">Оставить заявку</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">Ваше имя</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-3 rounded-none border-b border-stone-200 focus:outline-none focus:border-accent-500 transition-colors bg-transparent"
                    placeholder="Иван Иванов"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-2">Телефон</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="w-full px-4 py-3 rounded-none border-b border-stone-200 focus:outline-none focus:border-accent-500 transition-colors bg-transparent"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="tour" className="block text-sm font-medium text-stone-700 mb-2">Интересующий тур</label>
                <select 
                  id="tour" 
                  className="w-full px-4 py-3 rounded-none border-b border-stone-200 focus:outline-none focus:border-accent-500 transition-colors bg-transparent appearance-none"
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
                <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">Комментарий</label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="w-full px-4 py-3 rounded-none border-b border-stone-200 focus:outline-none focus:border-accent-500 transition-colors bg-transparent resize-none"
                  placeholder="Напишите ваши пожелания, даты поездки и количество человек..."
                ></textarea>
              </div>

              <button 
                type="submit"
                className="group relative inline-flex items-center justify-center w-full px-8 py-5 text-sm font-medium tracking-widest uppercase overflow-hidden bg-accent-500 text-white hover:text-white transition-colors duration-300"
              >
                <span className="absolute inset-0 bg-accent-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                <span className="relative z-10">Отправить заявку</span>
              </button>
              
              <p className="text-xs text-stone-500 text-center mt-4">
                Нажимая кнопку «Отправить заявку», вы соглашаетесь с политикой обработки персональных данных.
              </p>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
