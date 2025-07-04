-- Enable pg_net extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Ensure the trigger function uses the correct schema reference
CREATE OR REPLACE FUNCTION public.notify_referral_changes()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
BEGIN
  -- Prepare payload for the edge function
  IF TG_OP = 'INSERT' THEN
    payload := jsonb_build_object(
      'referral_id', NEW.id::text,
      'action', 'INSERT',
      'new_record', to_jsonb(NEW)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    payload := jsonb_build_object(
      'referral_id', NEW.id::text,
      'action', 'UPDATE',
      'old_record', to_jsonb(OLD),
      'new_record', to_jsonb(NEW)
    );
  END IF;

  -- Call the edge function using pg_net with explicit schema reference
  PERFORM extensions.net.http_post(
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
$$ LANGUAGE plpgsql SECURITY DEFINER;