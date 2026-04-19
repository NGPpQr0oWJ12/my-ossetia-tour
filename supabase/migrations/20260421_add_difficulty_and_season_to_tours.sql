-- Add difficulty and season columns to tours table
alter table public.tours 
add column difficulty text not null default 'Легкая',
add column season text not null default 'Круглый год';

-- Update RLS policies just in case (though existing 'all' policies for admin should cover it)
-- No changes needed to policies as they apply to the table as a whole.
