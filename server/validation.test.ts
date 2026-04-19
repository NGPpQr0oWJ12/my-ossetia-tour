import assert from "node:assert/strict";
import { parseHomeContent, parseLeadInsert, parseTourUpsert } from "./validation.ts";

function run() {
  const lead = parseLeadInsert({
    source_page: "home",
    name: "Ivan",
    phone: "+7999",
    message: "hello",
  });
  assert.equal(lead.source_page, "home");
  assert.equal(lead.name, "Ivan");

  const tour = parseTourUpsert({
    slug: "slug",
    title: "Title",
    short_description: "short",
    full_description: "full",
    price_from: "1000",
    duration: "1 day",
    group_size: "up to 4",
    location: "Ossetia",
    cover_image_url: "https://example.com/a.jpg",
    gallery: ["https://example.com/a.jpg"],
    is_published: true,
    sort_order: 1,
    seo_title: "seo",
    seo_description: "seo desc",
    program_items: [
      {
        title: "point",
        description: "desc",
        image_url: "https://example.com/b.jpg",
        position: 0,
      },
    ],
  });
  assert.equal(tour.program_items.length, 1);

  const home = parseHomeContent({
    hero_title: "hero",
    hero_subtitle: "subtitle",
    hero_image_url: "https://example.com/hero.jpg",
    featured_tour_ids: [1, 2, 3],
    cta_title: "cta",
    cta_text: "text",
    cta_primary_label: "go",
    cta_primary_url: "/tours",
    cta_secondary_label: "contact",
    cta_secondary_url: "/contacts",
  });
  assert.deepEqual(home.featured_tour_ids, [1, 2, 3]);
}

run();
// eslint-disable-next-line no-console
console.log("validation.test.ts passed");
