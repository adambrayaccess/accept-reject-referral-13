-- Create hcp table modeled on the practitioners table
CREATE TABLE public.hcp (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  external_id text,
  active boolean DEFAULT true,
  gender text,
  birth_date date,
  name text NOT NULL,
  role text,
  organization text,
  contact text,
  fhir_id text,
  qualification_code text,
  qualification_display text,
  qualification_issuer text
);

-- Enable Row Level Security
ALTER TABLE public.hcp ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for authenticated users
CREATE POLICY "Authenticated users can access hcp" 
ON public.hcp 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Add useful indexes
CREATE INDEX idx_hcp_name ON public.hcp(name);
CREATE INDEX idx_hcp_role ON public.hcp(role);
CREATE INDEX idx_hcp_organization ON public.hcp(organization);
CREATE INDEX idx_hcp_external_id ON public.hcp(external_id) WHERE external_id IS NOT NULL;