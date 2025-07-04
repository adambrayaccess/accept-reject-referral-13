-- Create trigger function to ensure triage_status is NULL when status is 'new'
CREATE OR REPLACE FUNCTION public.ensure_new_status_triage_consistency()
RETURNS TRIGGER AS $$
BEGIN
  -- If status is being set to 'new', ensure triage_status is NULL
  IF NEW.status = 'new' THEN
    NEW.triage_status = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that fires on INSERT and UPDATE
CREATE TRIGGER trigger_ensure_new_status_triage_consistency
  BEFORE INSERT OR UPDATE ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_new_status_triage_consistency();

-- Update existing referrals to fix any inconsistencies
UPDATE public.referrals 
SET triage_status = NULL 
WHERE status = 'new' AND triage_status IS NOT NULL;