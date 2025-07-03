-- Add team_id column to hcp table to link HCPs to teams
ALTER TABLE public.hcp 
ADD COLUMN team_id uuid REFERENCES public.teams(id) ON DELETE SET NULL;

-- Create an index on team_id for better query performance
CREATE INDEX idx_hcp_team_id ON public.hcp(team_id);

-- Add a comment to document the relationship
COMMENT ON COLUMN public.hcp.team_id IS 'References the team this healthcare professional belongs to';