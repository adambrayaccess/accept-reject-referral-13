-- Step 1: Backfill existing waiting list referrals into waiting_list_entries table
-- This migration will populate the waiting_list_entries table with referrals that have triage_status = 'waiting-list'

WITH waiting_list_referrals AS (
  SELECT 
    id as referral_id,
    specialty,
    created_at,
    'System Migration' as added_by
  FROM public.referrals 
  WHERE triage_status = 'waiting-list'
    AND status NOT IN ('discharged', 'complete')
    AND id NOT IN (SELECT referral_id FROM public.waiting_list_entries WHERE status = 'active')
),
ordered_referrals AS (
  SELECT 
    *,
    ROW_NUMBER() OVER (PARTITION BY specialty ORDER BY created_at ASC) as position
  FROM waiting_list_referrals
)
INSERT INTO public.waiting_list_entries (
  referral_id,
  specialty, 
  position,
  added_date,
  added_by,
  status,
  notes
)
SELECT 
  referral_id,
  specialty,
  position::integer,
  created_at,
  added_by,
  'active',
  'Migrated from existing waiting list referrals'
FROM ordered_referrals;

-- Step 2: Update referrals table to sync waiting list fields
UPDATE public.referrals 
SET 
  waiting_list_position = wle.position,
  waiting_list_added_date = wle.added_date,
  waiting_list_notes = wle.notes
FROM public.waiting_list_entries wle
WHERE referrals.id = wle.referral_id 
  AND wle.status = 'active'
  AND referrals.triage_status = 'waiting-list';

-- Step 3: Create function to add referral to waiting list
CREATE OR REPLACE FUNCTION public.add_to_waiting_list(
  referral_id_param uuid,
  specialty_param text,
  performed_by_param text,
  notes_param text DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  new_position integer;
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
  
  -- Check if already on waiting list
  IF EXISTS (
    SELECT 1 FROM public.waiting_list_entries 
    WHERE referral_id = referral_id_param 
      AND specialty = specialty_param 
      AND status = 'active'
  ) THEN
    RETURN FALSE;
  END IF;
  
  -- Get next position for this specialty
  SELECT COALESCE(MAX(position), 0) + 1 
  INTO new_position
  FROM public.waiting_list_entries 
  WHERE specialty = specialty_param AND status = 'active';
  
  -- Insert waiting list entry
  INSERT INTO public.waiting_list_entries (
    referral_id, 
    specialty, 
    position, 
    added_date, 
    added_by, 
    status,
    notes
  ) VALUES (
    referral_id_param, 
    specialty_param, 
    new_position, 
    now(), 
    performed_by_param,
    'active',
    notes_param
  );
  
  -- Update referral triage status and waiting list fields
  UPDATE public.referrals 
  SET 
    triage_status = 'waiting-list',
    waiting_list_position = new_position,
    waiting_list_added_date = now(),
    waiting_list_notes = notes_param,
    updated_at = now()
  WHERE id = referral_id_param;
  
  -- Log in audit log
  INSERT INTO public.audit_log (
    referral_id,
    action,
    user_name,
    notes
  ) VALUES (
    referral_id_param,
    'Added to waiting list',
    performed_by_param,
    COALESCE(notes_param, 'Added to ' || specialty_param || ' waiting list at position ' || new_position)
  );
  
  RETURN TRUE;
END;
$$;