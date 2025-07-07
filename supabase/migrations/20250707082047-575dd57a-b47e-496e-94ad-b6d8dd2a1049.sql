-- Add 'discharged' status to waiting list entries if not exists
DO $$ 
BEGIN
  -- Check if we need to add 'discharged' as a valid status for waiting list entries
  -- For now, we'll use the existing 'removed' status and track the reason
  
  -- Add 'complete' status to referral_status enum if not exists
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'referral_status' AND e.enumlabel = 'complete') THEN
    ALTER TYPE referral_status ADD VALUE 'complete';
  END IF;
  
  -- Add 'discharged' status to referral_status enum if not exists  
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'referral_status' AND e.enumlabel = 'discharged') THEN
    ALTER TYPE referral_status ADD VALUE 'discharged';
  END IF;
END $$;

-- Create function to handle waiting list discharge
CREATE OR REPLACE FUNCTION public.discharge_from_waiting_list(
  referral_id_param UUID,
  specialty_param TEXT,
  performed_by_param TEXT,
  discharge_reason TEXT DEFAULT 'Discharged from waiting list'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $function$
DECLARE
  waiting_list_entry RECORD;
BEGIN
  -- Get the current waiting list entry
  SELECT * INTO waiting_list_entry 
  FROM public.waiting_list_entries 
  WHERE referral_id = referral_id_param 
    AND specialty = specialty_param 
    AND status = 'active';
  
  -- If no active entry found, return false
  IF waiting_list_entry IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Update waiting list entry status to removed
  UPDATE public.waiting_list_entries 
  SET 
    status = 'removed',
    notes = COALESCE(notes || ' | ', '') || discharge_reason,
    updated_at = now()
  WHERE referral_id = referral_id_param 
    AND specialty = specialty_param 
    AND status = 'active';
  
  -- Update referral status to discharged
  UPDATE public.referrals 
  SET 
    status = 'discharged',
    waiting_list_position = NULL,
    waiting_list_added_date = NULL,
    waiting_list_priority_override = NULL,
    waiting_list_notes = NULL,
    updated_at = now()
  WHERE id = referral_id_param;
  
  -- Log the discharge in waiting list history
  INSERT INTO public.waiting_list_history (
    referral_id, 
    specialty, 
    action, 
    old_position, 
    performed_by, 
    notes
  ) VALUES (
    referral_id_param, 
    specialty_param, 
    'discharged', 
    waiting_list_entry.position, 
    performed_by_param,
    discharge_reason
  );
  
  -- Log in audit log
  INSERT INTO public.audit_log (
    referral_id,
    action,
    user_name,
    notes
  ) VALUES (
    referral_id_param,
    'Discharged from waiting list',
    performed_by_param,
    discharge_reason
  );
  
  RETURN TRUE;
END;
$function$;

-- Create function to handle pathway completion (for other completion scenarios)
CREATE OR REPLACE FUNCTION public.complete_referral_pathway(
  referral_id_param UUID,
  performed_by_param TEXT,
  completion_reason TEXT DEFAULT 'Pathway completed'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Update referral status to complete
  UPDATE public.referrals 
  SET 
    status = 'complete',
    updated_at = now()
  WHERE id = referral_id_param;
  
  -- If the referral is on a waiting list, remove it
  UPDATE public.waiting_list_entries 
  SET 
    status = 'removed',
    notes = COALESCE(notes || ' | ', '') || completion_reason,
    updated_at = now()
  WHERE referral_id = referral_id_param AND status = 'active';
  
  -- Clear waiting list fields from referrals
  UPDATE public.referrals 
  SET 
    waiting_list_position = NULL,
    waiting_list_added_date = NULL,
    waiting_list_priority_override = NULL,
    waiting_list_notes = NULL
  WHERE id = referral_id_param;
  
  -- Log in audit log
  INSERT INTO public.audit_log (
    referral_id,
    action,
    user_name,
    notes
  ) VALUES (
    referral_id_param,
    'Pathway completed',
    performed_by_param,
    completion_reason
  );
  
  RETURN TRUE;
END;
$function$;