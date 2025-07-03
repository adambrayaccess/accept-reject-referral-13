-- Add foreign key relationship between teams and specialties tables
-- First, add a new column for the specialty_id foreign key
ALTER TABLE public.teams 
ADD COLUMN specialty_id text REFERENCES public.specialties(id) ON DELETE SET NULL;

-- Update existing teams to use specialty IDs instead of names
-- Map specialty names to their corresponding IDs
UPDATE public.teams 
SET specialty_id = s.id 
FROM public.specialties s 
WHERE public.teams.specialty = s.name;

-- Create index on the foreign key for better performance
CREATE INDEX idx_teams_specialty_id ON public.teams(specialty_id);

-- Add comment to document the relationship
COMMENT ON COLUMN public.teams.specialty_id IS 'Foreign key reference to the specialties table';

-- Optional: You can drop the old specialty column after confirming the migration works
-- ALTER TABLE public.teams DROP COLUMN specialty;