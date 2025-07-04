-- Create function to send referral notifications via Edge Function
CREATE OR REPLACE FUNCTION public.notify_referral_changes()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
  response text;
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

  -- Call the edge function using pg_net (requires pg_net extension)
  -- Note: This is asynchronous and won't block the transaction
  PERFORM net.http_post(
    url := 'https://rsyhehcmsvwedmtnsoat.supabase.co/functions/v1/send-referral-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key', true)
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

-- Create triggers for INSERT and UPDATE on referrals table
CREATE TRIGGER referral_insert_notification_trigger
  AFTER INSERT ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_referral_changes();

CREATE TRIGGER referral_update_notification_trigger
  AFTER UPDATE ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_referral_changes();