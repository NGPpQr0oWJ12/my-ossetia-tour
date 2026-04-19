import type {
  HomeContentDto,
  LeadInsertDto,
  LeadStatus,
  LeadUpdateDto,
  TourProgramItemDto,
  TourUpsertDto,
} from "./types.ts";

const LEAD_STATUSES: LeadStatus[] = ["new", "in_progress", "booked", "closed_lost"];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function asStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  if (!value.every((item) => typeof item === "string")) return null;
  return value;
}

function asNumberArray(value: unknown): number[] | null {
  if (!Array.isArray(value)) return null;
  if (!value.every((item) => typeof item === "number" && Number.isFinite(item))) return null;
  return value;
}

export function parseLeadInsert(payload: unknown): LeadInsertDto {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be an object");
  }
  const body = payload as Record<string, unknown>;
  if (!isNonEmptyString(body.source_page)) throw new Error("source_page is required");
  if (!isNonEmptyString(body.name)) throw new Error("name is required");
  if (!isNonEmptyString(body.phone)) throw new Error("phone is required");

  const tourIdRaw = body.tour_id;
  const tourId =
    typeof tourIdRaw === "number" && Number.isFinite(tourIdRaw) ? tourIdRaw : null;

  return {
    source_page: body.source_page.trim(),
    tour_id: tourId,
    name: body.name.trim(),
    phone: body.phone.trim(),
    message: typeof body.message === "string" ? body.message.trim() : null,
  };
}

export function parseLeadUpdate(payload: unknown): LeadUpdateDto {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be an object");
  }
  const body = payload as Record<string, unknown>;
  const result: LeadUpdateDto = {};
  if (typeof body.status === "string") {
    if (!LEAD_STATUSES.includes(body.status as LeadStatus)) {
      throw new Error("Invalid status");
    }
    result.status = body.status as LeadStatus;
  }
  if (typeof body.manager_comment === "string" || body.manager_comment === null) {
    result.manager_comment = body.manager_comment as string | null;
  }
  return result;
}

function parseProgramItem(payload: unknown, index: number): TourProgramItemDto {
  if (!payload || typeof payload !== "object") {
    throw new Error(`program_items[${index}] must be an object`);
  }
  const body = payload as Record<string, unknown>;
  if (!isNonEmptyString(body.title)) throw new Error(`program_items[${index}].title is required`);
  if (!isNonEmptyString(body.description)) {
    throw new Error(`program_items[${index}].description is required`);
  }
  if (!isNonEmptyString(body.image_url)) {
    throw new Error(`program_items[${index}].image_url is required`);
  }
  const position =
    typeof body.position === "number" && Number.isFinite(body.position) ? body.position : index;
  return {
    title: body.title.trim(),
    description: body.description.trim(),
    image_url: body.image_url.trim(),
    position,
  };
}

export function parseTourUpsert(payload: unknown): TourUpsertDto {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be an object");
  }
  const body = payload as Record<string, unknown>;
  const requiredFields: Array<keyof TourUpsertDto> = [
    "slug",
    "title",
    "short_description",
    "full_description",
    "price_from",
    "duration",
    "group_size",
    "location",
    "cover_image_url",
    "seo_title",
    "seo_description",
  ];
  for (const field of requiredFields) {
    if (!isNonEmptyString(body[field])) {
      throw new Error(`${field} is required`);
    }
  }

  const gallery = asStringArray(body.gallery);
  if (!gallery) throw new Error("gallery must be a string[]");

  const programItemsRaw = body.program_items;
  if (!Array.isArray(programItemsRaw)) throw new Error("program_items must be an array");
  const program_items = programItemsRaw.map((item, index) => parseProgramItem(item, index));

  return {
    slug: (body.slug as string).trim(),
    title: (body.title as string).trim(),
    short_description: (body.short_description as string).trim(),
    full_description: (body.full_description as string).trim(),
    price_from: (body.price_from as string).trim(),
    duration: (body.duration as string).trim(),
    group_size: (body.group_size as string).trim(),
    location: (body.location as string).trim(),
    cover_image_url: (body.cover_image_url as string).trim(),
    gallery: gallery.map((item) => item.trim()).filter(Boolean),
    is_published: Boolean(body.is_published),
    sort_order:
      typeof body.sort_order === "number" && Number.isFinite(body.sort_order)
        ? body.sort_order
        : 0,
    seo_title: (body.seo_title as string).trim(),
    seo_description: (body.seo_description as string).trim(),
    program_items,
  };
}

export function parseHomeContent(payload: unknown): HomeContentDto {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be an object");
  }
  const body = payload as Record<string, unknown>;
  const requiredFields: Array<keyof Omit<HomeContentDto, "featured_tour_ids">> = [
    "hero_title",
    "hero_subtitle",
    "hero_image_url",
    "cta_title",
    "cta_text",
    "cta_primary_label",
    "cta_primary_url",
    "cta_secondary_label",
    "cta_secondary_url",
  ];
  for (const field of requiredFields) {
    if (!isNonEmptyString(body[field])) {
      throw new Error(`${field} is required`);
    }
  }
  const featured = asNumberArray(body.featured_tour_ids);
  if (!featured) throw new Error("featured_tour_ids must be number[]");

  const heroTourId =
    typeof body.hero_tour_id === "number" && Number.isFinite(body.hero_tour_id)
      ? body.hero_tour_id
      : null;

  return {
    hero_title: (body.hero_title as string).trim(),
    hero_subtitle: (body.hero_subtitle as string).trim(),
    hero_image_url: (body.hero_image_url as string).trim(),
    featured_tour_ids: featured,
    cta_title: (body.cta_title as string).trim(),
    cta_text: (body.cta_text as string).trim(),
    cta_primary_label: (body.cta_primary_label as string).trim(),
    cta_primary_url: (body.cta_primary_url as string).trim(),
    cta_secondary_label: (body.cta_secondary_label as string).trim(),
    cta_secondary_url: (body.cta_secondary_url as string).trim(),
    hero_tour_id: heroTourId,
  };
}
