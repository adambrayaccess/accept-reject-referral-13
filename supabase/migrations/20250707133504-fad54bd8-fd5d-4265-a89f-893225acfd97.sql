-- Function to automatically create RTT pathway when a new referral is created
CREATE OR REPLACE FUNCTION public.auto_create_rtt_pathway()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create RTT pathway for new referrals (not updates)
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.rtt_pathways (
      referral_id,
      clock_start_date,
      status
    ) VALUES (
      NEW.id,
      NEW.created_at,
      CASE 
        WHEN NEW.status = 'discharged' THEN 'completed'
        WHEN NEW.status = 'cancelled' THEN 'discontinued'
        ELSE 'active'
      END
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create RTT pathway on referral insert
CREATE TRIGGER trigger_auto_create_rtt_pathway
  AFTER INSERT ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_rtt_pathway();

-- Initialize RTT pathways for existing referrals that don't have them
INSERT INTO public.rtt_pathways (referral_id, clock_start_date, status)
SELECT 
  r.id,
  r.created_at,
  CASE 
    WHEN r.status = 'discharged' THEN 'completed'
    WHEN r.status = 'cancelled' THEN 'discontinued'
    ELSE 'active'
  END
FROM public.referrals r
LEFT JOIN public.rtt_pathways rp ON r.id = rp.referral_id
WHERE rp.id IS NULL;