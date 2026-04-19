export type LeadStatus = "new" | "in_progress" | "booked" | "closed_lost";

export interface SiteSettings {
  contacts_title: string;
  contacts_subtitle: string;
  office_text: string;
  phones_text: string;
  email_text: string;
  schedule_text: string;
  whatsapp_url: string;
  telegram_url: string;
  guide_name: string;
  guide_bio: string;
  guide_image_url: string;
}

export interface LeadStage {
  id: number;
  title: string;
  sort_order: number;
  color: string;
  created_at: string;
}


export interface Lead {
  id: number;
  source_page: string;
  tour_id: number | null;
  name: string;
  phone: string;
  message: string | null;
  status: LeadStatus;
  stage_id: number | null;
  manager_comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tour {
  id: number;
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
  difficulty: string;
  season: string;
  is_published: boolean;
  sort_order: number;
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
}

export interface TourProgramItem {
  id: number;
  tour_id: number;
  title: string;
  description: string;
  image_url: string;
  position: number;
}

export interface TourWithProgram extends Tour {
  program_items: TourProgramItem[];
}

export interface HomeContent {
  id: number;
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
  updated_at: string;
  featured_tours?: Tour[];
}

export interface LeadInsertInput {
  source_page: string;
  tour_id?: number | null;
  name: string;
  phone: string;
  message?: string;
}

export interface TourUpsertInput {
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
  difficulty: string;
  season: string;
  is_published: boolean;
  sort_order: number;
  seo_title: string;
  seo_description: string;
  program_items: Array<{
    title: string;
    description: string;
    image_url: string;
    position: number;
  }>;
}
