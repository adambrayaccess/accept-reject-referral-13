-- Create appointment details for all referrals with triage_status 'waiting-list'
INSERT INTO public.appointments (
  referral_id,
  appointment_date,
  appointment_time,
  type,
  status,
  location,
  consultant,
  notes
)
SELECT 
  r.id as referral_id,
  -- Schedule appointments 2-4 weeks from now
  CURRENT_DATE + INTERVAL '14 days' + (FLOOR(RANDOM() * 14)::INTEGER * INTERVAL '1 day') as appointment_date,
  -- Random appointment times between 9 AM and 5 PM
  ('09:00:00'::time + (FLOOR(RANDOM() * 8)::INTEGER * INTERVAL '1 hour') + (FLOOR(RANDOM() * 4)::INTEGER * INTERVAL '15 minutes')) as appointment_time,
  -- Set appointment type based on specialty
  CASE 
    WHEN r.specialty ILIKE '%cardiology%' THEN 'consultation'
    WHEN r.specialty ILIKE '%mental%' OR r.specialty ILIKE '%psych%' THEN 'assessment'
    WHEN r.specialty ILIKE '%surgery%' OR r.specialty ILIKE '%ortho%' THEN 'pre_operative'
    ELSE 'consultation'
  END::appointment_type as type,
  'scheduled'::appointment_status as status,
  -- Assign locations based on specialty
  CASE 
    WHEN r.specialty ILIKE '%cardiology%' THEN 'Cardiology Outpatients, Level 2'
    WHEN r.specialty ILIKE '%mental%' OR r.specialty ILIKE '%psych%' THEN 'Mental Health Unit, Ground Floor'
    WHEN r.specialty ILIKE '%dermatology%' THEN 'Dermatology Clinic, Level 1'
    WHEN r.specialty ILIKE '%gastro%' THEN 'Gastroenterology Unit, Level 3'
    WHEN r.specialty ILIKE '%neurology%' THEN 'Neurology Department, Level 4'
    WHEN r.specialty ILIKE '%rheumat%' THEN 'Rheumatology Clinic, Level 2'
    ELSE 'General Outpatients, Level 1'
  END as location,
  -- Assign consultants based on specialty
  CASE 
    WHEN r.specialty ILIKE '%cardiology%' THEN 'Dr. Sarah Johnson'
    WHEN r.specialty ILIKE '%mental%' OR r.specialty ILIKE '%psych%' THEN 'Dr. Michael Brown'
    WHEN r.specialty ILIKE '%dermatology%' THEN 'Dr. Emma Wilson'
    WHEN r.specialty ILIKE '%gastro%' THEN 'Dr. James Davis'
    WHEN r.specialty ILIKE '%neurology%' THEN 'Dr. Lisa Chen'
    WHEN r.specialty ILIKE '%rheumat%' THEN 'Dr. Robert Taylor'
    ELSE 'Dr. General Consultant'
  END as consultant,
  -- Add relevant notes
  CONCAT(
    'Initial consultation for ', 
    r.specialty, 
    ' referral. ',
    CASE 
      WHEN r.priority = 'urgent' THEN 'URGENT: Please ensure priority assessment. '
      WHEN r.priority = 'routine' THEN 'Routine appointment scheduled. '
      ELSE ''
    END,
    'Patient to bring relevant medical records and medication list.'
  ) as notes
FROM public.referrals r
WHERE r.triage_status = 'waiting-list'
  AND r.id NOT IN (
    -- Exclude referrals that already have appointments
    SELECT DISTINCT referral_id 
    FROM public.appointments 
    WHERE referral_id IS NOT NULL
  );