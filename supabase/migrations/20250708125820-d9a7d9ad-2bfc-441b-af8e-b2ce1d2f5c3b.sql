-- Modify the trigger function to only fire notifications when referral is created using Lovable
-- This prevents notifications from firing when referrals are created via edge functions

CREATE OR REPLACE FUNCTION public.notify_referral_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  payload jsonb;
BEGIN
  -- Only process notifications for referrals created using Lovable
  -- Skip notifications for edge function created referrals
  IF TG_OP = 'INSERT' THEN
    -- Check if this referral was created using Lovable (via the UI)
    IF NEW.notes IS NULL OR NEW.notes != 'Created using Lovable' THEN
      -- Skip notification for edge function created referrals
      RETURN NEW;
    END IF;
    
    payload := jsonb_build_object(
      'referral_id', NEW.id::text,
      'action', 'INSERT',
      'new_record', to_jsonb(NEW)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    -- For updates, only notify if the referral was originally created using Lovable
    IF OLD.notes IS NULL OR OLD.notes != 'Created using Lovable' THEN
      -- Skip notification for edge function created referrals
      RETURN NEW;
    END IF;
    
    payload := jsonb_build_object(
      'referral_id', NEW.id::text,
      'action', 'UPDATE',
      'old_record', to_jsonb(OLD),
      'new_record', to_jsonb(NEW)
    );
  END IF;

  -- Call the edge function using pg_net with correct schema reference
  PERFORM net.http_post(
    url := 'https://rsyhehcmsvwedmtnsoat.supabase.co/functions/v1/send-referral-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzeWhlaGNtc3Z3ZWRtdG5zb2F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDg1MzEsImV4cCI6MjA2NjQyNDUzMX0.s0Sn2IHtUNX5BpTianYJGBVpU9-nqPGLkZbCRjVCJAI'
    ),
    body := payload
  );

  -- Return the appropriate record
  IF TG_OP = 'INSERT' THEN
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$function$