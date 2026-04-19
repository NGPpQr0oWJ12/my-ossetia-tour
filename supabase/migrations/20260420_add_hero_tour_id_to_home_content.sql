-- Add hero_tour_id column to home_content
ALTER TABLE public.home_content
ADD COLUMN IF NOT EXISTS hero_tour_id bigint NULL;
