-- Create specialties table to centralize specialty management
CREATE TABLE public.specialties (
  id text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  active boolean NOT NULL DEFAULT true,
  display_order integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for specialties (read-only for authenticated users)
CREATE POLICY "Authenticated users can view specialties" 
ON public.specialties 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create specialties" 
ON public.specialties 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update specialties" 
ON public.specialties 
FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated users can delete specialties" 
ON public.specialties 
FOR DELETE 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_specialties_updated_at
BEFORE UPDATE ON public.specialties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Populate with existing specialty data from the application
INSERT INTO public.specialties (id, name, display_order) VALUES
('card', 'Cardiology', 1),
('derm', 'Dermatology', 2),
('endo', 'Endocrinology', 3),
('gast', 'Gastroenterology', 4),
('neur', 'Neurology', 5),
('onco', 'Oncology', 6),
('orth', 'Orthopedics', 7),
('psyc', 'Psychiatry', 8),
('pulm', 'Pulmonology', 9),
('rheu', 'Rheumatology', 10),
('mhea', 'Mental Health', 11);

-- Create an index on the name for better search performance
CREATE INDEX idx_specialties_name ON public.specialties(name);

-- Create an index on active status and display_order for efficient filtering and sorting
CREATE INDEX idx_specialties_active_order ON public.specialties(active, display_order);