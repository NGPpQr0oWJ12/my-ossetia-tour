insert into public.tours (
  slug,
  title,
  short_description,
  full_description,
  price_from,
  duration,
  group_size,
  location,
  cover_image_url,
  gallery,
  is_published,
  sort_order,
  seo_title,
  seo_description
)
values
(
  'karmadon-dargavs',
  'Karmadon Gorge and Dargavs',
  'One-day route with key landmarks of mountain Ossetia.',
  'Journey through Karmadon gorge, Dargavs and mountain viewpoints with local guide.',
  'from 3 500 RUB',
  '1 day',
  'up to 6 people',
  'North Ossetia',
  'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1200',
  '{"https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1200"}',
  true,
  1,
  'Karmadon Gorge and Dargavs tour',
  'Author one-day tour through Karmadon gorge and Dargavs.'
),
(
  'tsey-gorge',
  'Tsey Gorge and Glacier',
  'Classic route to mountain resort and glacier.',
  'Visit Tsey mountain resort, cable road and scenic points with stop in thermal area.',
  'from 4 000 RUB',
  '1 day',
  'up to 6 people',
  'North Ossetia',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
  '{"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200"}',
  true,
  2,
  'Tsey Gorge and Glacier tour',
  'Author one-day tour to Tsey gorge and glacier.'
),
(
  'digoria',
  'Digoria',
  'Extended route with waterfalls and mountain roads.',
  'Two-day route for travelers who want less tourist spots and more mountain nature.',
  'from 9 000 RUB',
  '2 days',
  'up to 4 people',
  'National Park Alania',
  'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1200',
  '{"https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1200"}',
  true,
  3,
  'Digoria route',
  'Two-day author tour in Digoria.'
)
on conflict (slug) do nothing;

insert into public.home_content (
  id,
  hero_title,
  hero_subtitle,
  hero_image_url,
  featured_tour_ids,
  cta_title,
  cta_text,
  cta_primary_label,
  cta_primary_url,
  cta_secondary_label,
  cta_secondary_url
)
select
  1,
  'Explore Ossetia with Local Guides',
  'Author routes through mountains, history and authentic places.',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000',
  array_agg(id order by sort_order asc),
  'Ready for your next route?',
  'Send request and we will prepare a custom trip for your dates.',
  'View tours',
  '/tours',
  'Contacts',
  '/contacts'
from public.tours
where is_published = true
on conflict (id) do update
set
  hero_title = excluded.hero_title,
  hero_subtitle = excluded.hero_subtitle,
  hero_image_url = excluded.hero_image_url,
  featured_tour_ids = excluded.featured_tour_ids,
  cta_title = excluded.cta_title,
  cta_text = excluded.cta_text,
  cta_primary_label = excluded.cta_primary_label,
  cta_primary_url = excluded.cta_primary_url,
  cta_secondary_label = excluded.cta_secondary_label,
  cta_secondary_url = excluded.cta_secondary_url;
