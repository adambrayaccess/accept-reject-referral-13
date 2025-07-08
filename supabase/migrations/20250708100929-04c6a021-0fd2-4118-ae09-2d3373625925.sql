-- Drop the existing separate triggers
DROP TRIGGER IF EXISTS referral_insert_notification_trigger ON public.referrals;
DROP TRIGGER IF EXISTS referral_update_notification_trigger ON public.referrals;

-- Create a single trigger that handles both INSERT and UPDATE
CREATE TRIGGER referral_changes_notification_trigger
  AFTER INSERT OR UPDATE ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_referral_changes();