-- Add referral_source column to referrals table
ALTER TABLE public.referrals ADD COLUMN referral_source text;

-- Migrate existing data based on referrer organization
UPDATE public.referrals 
SET referral_source = CASE 
  WHEN referrer.organization IS NULL THEN 'GP'
  WHEN LOWER(referrer.organization) LIKE '%hospital%' THEN 'Hospital'
  WHEN LOWER(referrer.organization) LIKE '%clinic%' THEN 'Clinic'
  WHEN LOWER(referrer.organization) LIKE '%emergency%' THEN 'A&E'
  ELSE 'GP'
END
FROM public.practitioners referrer
WHERE public.referrals.referrer_id = referrer.id;