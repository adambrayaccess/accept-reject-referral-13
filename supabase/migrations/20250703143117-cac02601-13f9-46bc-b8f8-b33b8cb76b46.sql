-- First, let's get some patient IDs to work with
-- We'll create sample reasonable adjustments and their details

-- Insert sample reasonable adjustments records
INSERT INTO public.reasonable_adjustments (patient_id, has_adjustments, flag_level, updated_by) 
SELECT 
    p.id,
    true,
    CASE 
        WHEN random() < 0.3 THEN 'high'::flag_level
        WHEN random() < 0.6 THEN 'medium'::flag_level
        ELSE 'low'::flag_level
    END,
    'System Data Generator'
FROM (
    SELECT id FROM public.patients 
    WHERE active = true 
    LIMIT 5
) p;

-- Now insert detailed adjustment records for each reasonable adjustment
-- Communication and Language Support adjustments
INSERT INTO public.adjustment_details (
    reasonable_adjustments_id, 
    category, 
    description, 
    specific_needs, 
    recorded_by, 
    implementation_notes,
    review_date,
    status
) 
SELECT 
    ra.id,
    'communication'::adjustment_category,
    'British Sign Language (BSL) interpreter required',
    'Patient is profoundly deaf and communicates primarily through BSL. Requires qualified BSL interpreter for all appointments and consultations.',
    'Dr. Sarah Mitchell',
    'Contact BSL Services (Tel: 020 7946 0123) at least 48 hours before appointment. Interpreter should be briefed on medical terminology.',
    (CURRENT_DATE + INTERVAL '6 months'),
    'active'::adjustment_status
FROM public.reasonable_adjustments ra
LIMIT 1;

-- Physical Access adjustments
INSERT INTO public.adjustment_details (
    reasonable_adjustments_id, 
    category, 
    description, 
    specific_needs, 
    recorded_by, 
    implementation_notes,
    review_date,
    status
) 
SELECT 
    ra.id,
    'physical'::adjustment_category,
    'Wheelchair accessible facilities and ground floor appointments',
    'Patient uses electric wheelchair and requires step-free access. Cannot use stairs or narrow doorways.',
    'Occupational Therapist Jane Brown',
    'Book ground floor consulting rooms only. Ensure accessible parking space is reserved. Check lift is working before appointment.',
    (CURRENT_DATE + INTERVAL '12 months'),
    'active'::adjustment_status
FROM public.reasonable_adjustments ra
OFFSET 1 LIMIT 1;

-- Cognitive Support adjustments
INSERT INTO public.adjustment_details (
    reasonable_adjustments_id, 
    category, 
    description, 
    specific_needs, 
    recorded_by, 
    implementation_notes,
    review_date,
    status
) 
SELECT 
    ra.id,
    'cognitive'::adjustment_category,
    'Easy Read materials and extended appointment time',
    'Patient has learning difficulties and requires information in accessible formats. Needs extra time to process information.',
    'Learning Disability Nurse Paul Wilson',
    'Prepare Easy Read appointment letters and information leaflets. Allow double appointment time. Use simple language and visual aids.',
    (CURRENT_DATE + INTERVAL '3 months'),
    'active'::adjustment_status
FROM public.reasonable_adjustments ra
OFFSET 2 LIMIT 1;

-- Sensory adjustments
INSERT INTO public.adjustment_details (
    reasonable_adjustments_id, 
    category, 
    description, 
    specific_needs, 
    recorded_by, 
    implementation_notes,
    review_date,
    status
) 
SELECT 
    ra.id,
    'sensory'::adjustment_category,
    'Large print materials and good lighting',
    'Patient has severe visual impairment. Requires large print (minimum 18pt font) and high contrast materials.',
    'Visual Impairment Specialist Lisa Chen',
    'Print all documents in 18pt Arial font on yellow paper. Ensure consultation room has bright lighting. Offer magnifying equipment.',
    (CURRENT_DATE + INTERVAL '6 months'),
    'active'::adjustment_status
FROM public.reasonable_adjustments ra
OFFSET 3 LIMIT 1;

-- Behavioral Support adjustments
INSERT INTO public.adjustment_details (
    reasonable_adjustments_id, 
    category, 
    description, 
    specific_needs, 
    recorded_by, 
    implementation_notes,
    review_date,
    status
) 
SELECT 
    ra.id,
    'other'::adjustment_category,
    'Quiet environment and familiar support person',
    'Patient has autism spectrum condition and experiences anxiety in busy environments. Benefits from consistent healthcare providers.',
    'Mental Health Practitioner Dr. Emma Thompson',
    'Schedule appointments during quieter periods (avoid 9-11am). Allow support person to accompany patient. Minimize waiting time.',
    (CURRENT_DATE + INTERVAL '4 months'),
    'active'::adjustment_status
FROM public.reasonable_adjustments ra
OFFSET 4 LIMIT 1;

-- Add some additional detailed adjustments for the first patient
INSERT INTO public.adjustment_details (
    reasonable_adjustments_id, 
    category, 
    description, 
    specific_needs, 
    recorded_by, 
    implementation_notes,
    review_date,
    status
) 
SELECT 
    ra.id,
    'physical'::adjustment_category,
    'Assistance with mobility and transfers',
    'Patient requires assistance moving from wheelchair to examination couch. Cannot stand unassisted.',
    'Physiotherapist Mark Johnson',
    'Two staff members required for safe transfer. Use slide sheets and hoist if available. Patient can partially weight bear on left leg.',
    (CURRENT_DATE + INTERVAL '6 months'),
    'active'::adjustment_status
FROM public.reasonable_adjustments ra
LIMIT 1;

-- Add a resolved adjustment example
INSERT INTO public.adjustment_details (
    reasonable_adjustments_id, 
    category, 
    description, 
    specific_needs, 
    recorded_by, 
    implementation_notes,
    review_date,
    status
) 
SELECT 
    ra.id,
    'communication'::adjustment_category,
    'Translation services for Bengali language',
    'Patient required Bengali interpreter for medical consultations.',
    'Dr. Amira Hassan',
    'Patient''s English has improved significantly through community classes. No longer requires interpreter services as of review.',
    (CURRENT_DATE - INTERVAL '1 month'),
    'resolved'::adjustment_status
FROM public.reasonable_adjustments ra
LIMIT 1;