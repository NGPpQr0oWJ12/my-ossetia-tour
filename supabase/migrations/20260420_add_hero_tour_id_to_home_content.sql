-- Add hero_tour_id column to home_content with foreign key reference
ALTER TABLE public.home_content 
ADD COLUMN IF NOT EXISTS hero_tour_id bigint NULL 
REFERENCES public.tours(id) ON DELETE SET NULL;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
