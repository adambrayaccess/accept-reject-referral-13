-- Update the discharge function to handle referrals without waiting list entries
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
  referral_record RECORD;
BEGIN
  -- Get the referral record first
  SELECT * INTO referral_record 
  FROM public.referrals 
  WHERE id = referral_id_param;
  
  -- Check if referral exists
  IF referral_record IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Get the current waiting list entry (if it exists)
  SELECT * INTO waiting_list_entry 
  FROM public.waiting_list_entries 
  WHERE referral_id = referral_id_param 
    AND specialty = specialty_param 
    AND status = 'active';
  
  -- If there's a waiting list entry, update it to removed
  IF waiting_list_entry IS NOT NULL THEN
    UPDATE public.waiting_list_entries 
    SET 
      status = 'removed',
      notes = COALESCE(notes || ' | ', '') || discharge_reason,
      updated_at = now()
    WHERE referral_id = referral_id_param 
      AND specialty = specialty_param 
      AND status = 'active';
      
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
  END IF;
  
  -- Always update referral status to discharged and clear waiting list fields
  UPDATE public.referrals 
  SET 
    status = 'discharged',
    triage_status = NULL,  -- Clear triage status as well
    waiting_list_position = NULL,
    waiting_list_added_date = NULL,
    waiting_list_priority_override = NULL,
    waiting_list_notes = NULL,
    updated_at = now()
  WHERE id = referral_id_param;
  
  -- Always log in audit log
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
  
  -- If there was no waiting list entry, still log in waiting list history
  IF waiting_list_entry IS NULL THEN
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
      NULL, -- No position if no entry existed
      performed_by_param,
      discharge_reason || ' (No waiting list entry found)'
    );
  END IF;
  
  RETURN TRUE;
END;
$function$;