import type { HomeContentDto, TourUpsertDto } from "./types.ts";

export const DEFAULT_TOURS: TourUpsertDto[] = [
  {
    slug: "karmadon-dargavs",
    title: "Кармадонское ущелье и Даргавс",
    short_description:
      "Путешествие по местам силы. Вы увидите Кармадонское ущелье и древний некрополь Даргавс.",
    full_description:
      "Путешествие по местам силы. Вы увидите печально известное Кармадонское ущелье, древний некрополь Даргавс (Город мертвых) и Мидаграбинские водопады.",
    price_from: "от 3 500 ₽",
    duration: "1 день",
    group_size: "до 6 человек",
    location: "Северная Осетия",
    cover_image_url: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1200",
    gallery: ["https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1200"],
    is_published: true,
    sort_order: 1,
    seo_title: "Кармадонское ущелье и Даргавс",
    seo_description: "Однодневный авторский тур по Кармадону и Даргавсу.",
    program_items: [],
  },
  {
    slug: "tsey-gorge",
    title: "Цейское ущелье и Сказский ледник",
    short_description:
      "Жемчужина Северной Осетии: канатная дорога, ледник, святилище Реком и источники.",
    full_description:
      "Жемчужина Северной Осетии. Подъем по канатной дороге к Сказскому леднику, посещение святилища Реком и купание в термальных источниках Бирагзанг.",
    price_from: "от 4 000 ₽",
    duration: "1 день",
    group_size: "до 6 человек",
    location: "Северная Осетия",
    cover_image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200",
    gallery: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200"],
    is_published: true,
    sort_order: 2,
    seo_title: "Цейское ущелье и Сказский ледник",
    seo_description: "Однодневный маршрут по Цейскому ущелью.",
    program_items: [],
  },
  {
    slug: "digoria",
    title: "Дигория — край тысячи водопадов",
    short_description:
      "Двухдневное погружение в самую отдаленную и живописную часть республики.",
    full_description:
      "Двухдневное погружение в самую отдаленную и живописную часть республики. Национальный парк Алания, древние башни, водопады Три сестры и ледник Караугом.",
    price_from: "от 9 000 ₽",
    duration: "2 дня",
    group_size: "до 4 человек",
    location: "Нац. парк Алания",
    cover_image_url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1200",
    gallery: ["https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1200"],
    is_published: true,
    sort_order: 3,
    seo_title: "Дигория — край тысячи водопадов",
    seo_description: "Двухдневный тур по Дигории.",
    program_items: [],
  },
  {
    slug: "kurtat-gorge",
    title: "Куртатинское ущелье",
    short_description:
      "Кадаргаванский каньон, скальная крепость Дзивгис и качели над пропастью.",
    full_description:
      "Самый популярный маршрут. Кадаргаванский каньон, скальная крепость Дзивгис, самый высокогорный монастырь в России и качели над пропастью.",
    price_from: "от 3 500 ₽",
    duration: "1 день",
    group_size: "до 6 человек",
    location: "Северная Осетия",
    cover_image_url: "https://images.unsplash.com/photo-1540390769625-2fc3f8b1d50c?q=80&w=1200",
    gallery: ["https://images.unsplash.com/photo-1540390769625-2fc3f8b1d50c?q=80&w=1200"],
    is_published: true,
    sort_order: 4,
    seo_title: "Куртатинское ущелье",
    seo_description: "Однодневный тур по Куртатинскому ущелью.",
    program_items: [],
  },
  {
    slug: "mountain-ingushetia",
    title: "Горная Ингушетия",
    short_description:
      "Путешествие в соседнюю республику: Вовнушки, Эгикал, Таргим и Тхаба-Ерды.",
    full_description:
      "Путешествие в соседнюю республику. Страна башен: величественные комплексы Вовнушки, Эгикал, Таргим и древнейший христианский храм Тхаба-Ерды.",
    price_from: "от 4 500 ₽",
    duration: "1 день",
    group_size: "до 4 человек",
    location: "Ингушетия",
    cover_image_url: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1200",
    gallery: ["https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1200"],
    is_published: true,
    sort_order: 5,
    seo_title: "Горная Ингушетия",
    seo_description: "Однодневный тур по горной Ингушетии.",
    program_items: [],
  },
  {
    slug: "bermamyt-jeep",
    title: "Джип-тур на плато Бермамыт",
    short_description:
      "Встреча рассвета с видом на Эльбрус, внедорожники и панорамные точки.",
    full_description:
      "Встреча рассвета с лучшим видом на Эльбрус. Экстремальный подъем на внедорожниках, невероятные пейзажи и горячий кофе на краю пропасти.",
    price_from: "от 5 000 ₽",
    duration: "1 день",
    group_size: "до 4 человек",
    location: "КЧР",
    cover_image_url: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200",
    gallery: ["https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200"],
    is_published: true,
    sort_order: 6,
    seo_title: "Джип-тур на плато Бермамыт",
    seo_description: "Однодневный джип-тур на Бермамыт.",
    program_items: [],
  },
];

export const DEFAULT_HOME_CONTENT: HomeContentDto = {
  hero_title: "Открой настоящую Аланию",
  hero_subtitle:
    "Авторские экспедиции по горной Осетии. Влюбляем в горы тех, кто видит их впервые.",
  hero_image_url: "/12476587.jpg",
  featured_tour_ids: [],
  cta_title: "Готовы к незабываемому путешествию?",
  cta_text:
    "Напишите нам, и мы подберем идеальный авторский маршрут, учитывая ваши пожелания и уровень подготовки.",
  cta_primary_label: "Выбрать тур",
  cta_primary_url: "/tours",
  cta_secondary_label: "Контакты",
  cta_secondary_url: "/contacts",
  hero_tour_id: null,
};

export const DEFAULT_SITE_SETTINGS = {
  contacts_title: "Свяжитесь с нами",
  contacts_subtitle: "Мы готовы ответить на любые вопросы и организовать тур вашей мечты",
  office_text: "г. Владикавказ, пр. Мира, 1\nРеспублика Северная Осетия-Алания",
  phones_text: "+7 (999) 123-45-67\n+7 (999) 765-43-21",
  email_text: "travel@myossetia.ru",
  schedule_text: "Ежедневно: 09:00 – 20:00\nБез выходных",
  whatsapp_url: "https://wa.me/79000000000",
  telegram_url: "https://t.me/yourid",
  guide_name: "Тимур",
  guide_bio:
    "Меня зовут Тимур. Я родился и вырос в Северной Осетии, с самого детства люблю нашу природу и горы.",
  guide_image_url: "/gid.png",
};
