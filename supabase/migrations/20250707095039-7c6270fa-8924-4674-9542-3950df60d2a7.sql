-- Create function to update referral triage status when waiting list entry is discharged
CREATE OR REPLACE FUNCTION public.update_referral_triage_status_on_waiting_list_discharge()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $function$
BEGIN
  -- When a waiting list entry status is updated to 'discharged'
  IF NEW.status = 'discharged' AND (OLD.status IS NULL OR OLD.status != 'discharged') THEN
    -- Update the corresponding referral's triage_status to 'discharged'
    UPDATE public.referrals 
    SET 
      triage_status = 'discharged',
      updated_at = now()
    WHERE id = NEW.referral_id;
    
    -- Log the change in audit log
    INSERT INTO public.audit_log (
      referral_id,
      action,
      user_name,
      notes
    ) VALUES (
      NEW.referral_id,
      'Triage status updated to discharged',
      COALESCE(NEW.added_by, 'System'),
      'Triage status automatically updated to discharged due to waiting list entry discharge'
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger on waiting_list_entries table
DROP TRIGGER IF EXISTS trigger_update_referral_triage_status_on_discharge ON public.waiting_list_entries;

CREATE TRIGGER trigger_update_referral_triage_status_on_discharge
  AFTER UPDATE ON public.waiting_list_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_referral_triage_status_on_waiting_list_discharge();

-- Also handle existing discharged waiting list entries
UPDATE public.referrals 
SET 
  triage_status = 'discharged',
  updated_at = now()
WHERE id IN (
  SELECT referral_id 
  FROM public.waiting_list_entries 
  WHERE status = 'discharged'
) AND (triage_status IS NULL OR triage_status != 'discharged');