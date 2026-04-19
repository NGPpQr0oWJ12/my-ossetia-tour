export type LeadStatus = "new" | "in_progress" | "booked" | "closed_lost";

export interface LeadInsertDto {
  source_page: string;
  tour_id?: number | null;
  name: string;
  phone: string;
  message?: string | null;
}

export interface LeadUpdateDto {
  stage_id?: number;
  manager_comment?: string | null;
}

export interface LeadStageDto {
  title: string;
  sort_order: number;
  color: string;
}

export interface TourProgramItemDto {
  title: string;
  description: string;
  image_url: string;
  position: number;
}

export interface TourUpsertDto {
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  price_from: string;
  duration: string;
  group_size: string;
  location: string;
  cover_image_url: string;
  gallery: string[];
  is_published: boolean;
  sort_order: number;
  seo_title: string;
  seo_description: string;
  difficulty?: string;
  season?: string;
  program_items: TourProgramItemDto[];
}

export interface HomeContentDto {
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  featured_tour_ids: number[];
  cta_title: string;
  cta_text: string;
  cta_primary_label: string;
  cta_primary_url: string;
  cta_secondary_label: string;
  cta_secondary_url: string;
  hero_tour_id: number | null;
}
