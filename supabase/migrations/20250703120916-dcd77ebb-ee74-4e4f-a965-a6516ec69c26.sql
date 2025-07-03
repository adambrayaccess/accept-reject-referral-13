-- Add patient_area_care_setting column to referrals table
ALTER TABLE public.referrals 
ADD COLUMN patient_area_care_setting TEXT;

-- Add a check constraint to ensure only valid values are allowed
ALTER TABLE public.referrals 
ADD CONSTRAINT check_patient_area_care_setting 
CHECK (patient_area_care_setting IS NULL OR patient_area_care_setting IN (
  'Community and Clinic',
  'Admission Referral (Community Beds)', 
  'Day Care',
  'Admission Referral (Intermediate Care)',
  'Outpatient (non Consultant)',
  'Outpatient (Consultant led)'
));