-- Generate sample healthcare professionals data
-- Get team IDs to work with
WITH sample_teams AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn FROM public.teams 
    WHERE active = true 
    LIMIT 10
)

-- Insert healthcare professionals
INSERT INTO public.hcp (
    name,
    active,
    birth_date,
    contact,
    external_id,
    gender,
    organization,
    qualification_code,
    qualification_display,
    qualification_issuer,
    role,
    team_id
)
-- Consultant Psychiatrists
SELECT 
    CASE gs % 12
        WHEN 1 THEN 'Dr. Sarah Mitchell'
        WHEN 2 THEN 'Dr. James Wilson'
        WHEN 3 THEN 'Dr. Emma Thompson'
        WHEN 4 THEN 'Dr. Michael Brown'
        WHEN 5 THEN 'Dr. Lisa Garcia'
        WHEN 6 THEN 'Dr. David Chen'
        WHEN 7 THEN 'Dr. Rachel Green'
        WHEN 8 THEN 'Dr. Alex Rodriguez'
        WHEN 9 THEN 'Dr. Catherine Lee'
        WHEN 10 THEN 'Dr. Andrew Davis'
        WHEN 11 THEN 'Dr. Helen Roberts'
        ELSE 'Dr. Peter Collins'
    END,
    true,
    ('1970-01-01'::date + (gs * INTERVAL '200 days'))::date,
    CASE gs % 4
        WHEN 0 THEN 'sarah.mitchell@nhs.uk'
        WHEN 1 THEN 'james.wilson@nhs.uk'
        WHEN 2 THEN 'emma.thompson@nhs.uk'
        ELSE 'michael.brown@nhs.uk'
    END,
    'HCP' || lpad(gs::text, 6, '0'),
    CASE gs % 3
        WHEN 0 THEN 'female'
        WHEN 1 THEN 'male'
        ELSE 'female'
    END,
    CASE gs % 6
        WHEN 0 THEN 'Manchester Mental Health Trust'
        WHEN 1 THEN 'Birmingham Community Healthcare NHS Trust'
        WHEN 2 THEN 'Leeds Mental Health Services'
        WHEN 3 THEN 'Sheffield Health and Social Care NHS Trust'
        WHEN 4 THEN 'Newcastle Mental Health Unit'
        ELSE 'Bristol Mental Health Foundation'
    END,
    '1184',
    'Consultant Psychiatrist',
    'Royal College of Psychiatrists',
    'Consultant Psychiatrist',
    (SELECT id FROM sample_teams WHERE rn = ((gs - 1) % 8) + 1)
FROM generate_series(1, 12) AS gs

UNION ALL

-- Senior Mental Health Nurses
SELECT 
    CASE gs % 15
        WHEN 1 THEN 'Sarah Johnson'
        WHEN 2 THEN 'Mark Thompson'
        WHEN 3 THEN 'Jennifer Walsh'
        WHEN 4 THEN 'Robert Taylor'
        WHEN 5 THEN 'Amanda Clarke'
        WHEN 6 THEN 'Daniel Williams'
        WHEN 7 THEN 'Lisa Anderson'
        WHEN 8 THEN 'Christopher Moore'
        WHEN 9 THEN 'Michelle Turner'
        WHEN 10 THEN 'Kevin Phillips'
        WHEN 11 THEN 'Claire Edwards'
        WHEN 12 THEN 'Matthew Harris'
        WHEN 13 THEN 'Natalie Cooper'
        WHEN 14 THEN 'Stuart Lewis'
        ELSE 'Rebecca White'
    END,
    true,
    ('1975-01-01'::date + (gs * INTERVAL '150 days'))::date,
    CASE gs % 5
        WHEN 0 THEN 'sarah.johnson@nhs.uk'
        WHEN 1 THEN 'mark.thompson@nhs.uk'
        WHEN 2 THEN 'jennifer.walsh@nhs.uk'
        WHEN 3 THEN 'robert.taylor@nhs.uk'
        ELSE 'amanda.clarke@nhs.uk'
    END,
    'NURSE' || lpad(gs::text, 5, '0'),
    CASE gs % 3
        WHEN 0 THEN 'female'
        WHEN 1 THEN 'male'
        ELSE 'female'
    END,
    CASE gs % 5
        WHEN 0 THEN 'Greater Manchester Mental Health NHS Trust'
        WHEN 1 THEN 'South London and Maudsley NHS Trust'
        WHEN 2 THEN 'Mersey Care NHS Trust'
        WHEN 3 THEN 'Tees, Esk and Wear Valleys NHS Trust'
        ELSE 'West London Mental Health NHS Trust'
    END,
    '2171',
    'Registered Mental Health Nurse',
    'Nursing and Midwifery Council',
    'Senior Mental Health Nurse',
    (SELECT id FROM sample_teams WHERE rn = ((gs - 1) % 8) + 1)
FROM generate_series(1, 15) AS gs

UNION ALL

-- Clinical Psychologists
SELECT 
    CASE gs % 10
        WHEN 1 THEN 'Dr. Anna Mitchell'
        WHEN 2 THEN 'Dr. John Phillips'
        WHEN 3 THEN 'Dr. Lisa Turner'
        WHEN 4 THEN 'Dr. Mark Wilson'
        WHEN 5 THEN 'Dr. Catherine Jones'
        WHEN 6 THEN 'Dr. Robert Brown'
        WHEN 7 THEN 'Dr. Jennifer Davis'
        WHEN 8 THEN 'Dr. Stephen White'
        WHEN 9 THEN 'Dr. Helen Martin'
        ELSE 'Dr. Paul Jackson'
    END,
    true,
    ('1978-01-01'::date + (gs * INTERVAL '180 days'))::date,
    CASE gs % 4
        WHEN 0 THEN 'anna.mitchell@nhs.uk'
        WHEN 1 THEN 'john.phillips@nhs.uk'
        WHEN 2 THEN 'lisa.turner@nhs.uk'
        ELSE 'mark.wilson@nhs.uk'
    END,
    'PSYC' || lpad(gs::text, 5, '0'),
    CASE gs % 3
        WHEN 0 THEN 'female'
        WHEN 1 THEN 'male'
        ELSE 'female'
    END,
    CASE gs % 4
        WHEN 0 THEN 'Oxleas NHS Foundation Trust'
        WHEN 1 THEN 'Camden and Islington NHS Foundation Trust'
        WHEN 2 THEN 'Nottinghamshire Healthcare NHS Trust'
        ELSE 'Derbyshire Healthcare NHS Foundation Trust'
    END,
    '2189',
    'Clinical Psychologist',
    'Health and Care Professions Council',
    'Clinical Psychologist',
    (SELECT id FROM sample_teams WHERE rn = ((gs - 1) % 6) + 1)
FROM generate_series(1, 10) AS gs

UNION ALL

-- Social Workers
SELECT 
    CASE gs % 12
        WHEN 1 THEN 'Jane Roberts'
        WHEN 2 THEN 'Michael Scott'
        WHEN 3 THEN 'Caroline Davies'
        WHEN 4 THEN 'Thomas Evans'
        WHEN 5 THEN 'Samantha Wood'
        WHEN 6 THEN 'David Parker'
        WHEN 7 THEN 'Louise Baker'
        WHEN 8 THEN 'Andrew Carter'
        WHEN 9 THEN 'Emma Stewart'
        WHEN 10 THEN 'James Kelly'
        WHEN 11 THEN 'Rachel Price'
        ELSE 'Simon Bell'
    END,
    true,
    ('1980-01-01'::date + (gs * INTERVAL '120 days'))::date,
    CASE gs % 4
        WHEN 0 THEN 'jane.roberts@council.gov.uk'
        WHEN 1 THEN 'michael.scott@council.gov.uk'
        WHEN 2 THEN 'caroline.davies@council.gov.uk'
        ELSE 'thomas.evans@council.gov.uk'
    END,
    'SW' || lpad(gs::text, 6, '0'),
    CASE gs % 3
        WHEN 0 THEN 'female'
        WHEN 1 THEN 'male'
        ELSE 'female'
    END,
    CASE gs % 4
        WHEN 0 THEN 'Manchester City Council'
        WHEN 1 THEN 'Birmingham City Council'
        WHEN 2 THEN 'Leeds City Council'
        ELSE 'Sheffield City Council'
    END,
    '2213',
    'Social Worker',
    'Social Work England',
    'Mental Health Social Worker',
    (SELECT id FROM sample_teams WHERE rn = ((gs - 1) % 5) + 1)
FROM generate_series(1, 12) AS gs

UNION ALL

-- Occupational Therapists
SELECT 
    CASE gs % 8
        WHEN 1 THEN 'Sophie Williams'
        WHEN 2 THEN 'Daniel Roberts'
        WHEN 3 THEN 'Laura Johnson'
        WHEN 4 THEN 'Matthew Brown'
        WHEN 5 THEN 'Rachel Davis'
        WHEN 6 THEN 'Christopher Miller'
        WHEN 7 THEN 'Victoria Wilson'
        ELSE 'Benjamin Moore'
    END,
    true,
    ('1982-01-01'::date + (gs * INTERVAL '100 days'))::date,
    CASE gs % 3
        WHEN 0 THEN 'sophie.williams@nhs.uk'
        WHEN 1 THEN 'daniel.roberts@nhs.uk'
        ELSE 'laura.johnson@nhs.uk'
    END,
    'OT' || lpad(gs::text, 6, '0'),
    CASE gs % 3
        WHEN 0 THEN 'female'
        WHEN 1 THEN 'male'
        ELSE 'female'
    END,
    CASE gs % 3
        WHEN 0 THEN 'Leicestershire Partnership NHS Trust'
        WHEN 1 THEN 'Norfolk and Suffolk NHS Foundation Trust'
        ELSE 'Cornwall Partnership NHS Foundation Trust'
    END,
    '2218',
    'Occupational Therapist',
    'Health and Care Professions Council',
    'Mental Health Occupational Therapist',
    (SELECT id FROM sample_teams WHERE rn = ((gs - 1) % 4) + 1)
FROM generate_series(1, 8) AS gs

UNION ALL

-- Support Workers and Care Coordinators
SELECT 
    CASE gs % 16
        WHEN 1 THEN 'Maria Santos'
        WHEN 2 THEN 'Kevin O''Connor'
        WHEN 3 THEN 'Tracey Morgan'
        WHEN 4 THEN 'Gary Henderson'
        WHEN 5 THEN 'Nicola Fisher'
        WHEN 6 THEN 'Paul Anderson'
        WHEN 7 THEN 'Sharon Clarke'
        WHEN 8 THEN 'Ian Campbell'
        WHEN 9 THEN 'Julie Thompson'
        WHEN 10 THEN 'Craig Williams'
        WHEN 11 THEN 'Deborah Taylor'
        WHEN 12 THEN 'Neil Patterson'
        WHEN 13 THEN 'Angela Hill'
        WHEN 14 THEN 'Ross Murray'
        WHEN 15 THEN 'Fiona Graham'
        ELSE 'Steven Ross'
    END,
    true,
    ('1985-01-01'::date + (gs * INTERVAL '80 days'))::date,
    CASE gs % 5
        WHEN 0 THEN 'maria.santos@nhs.uk'
        WHEN 1 THEN 'kevin.oconnor@nhs.uk'
        WHEN 2 THEN 'tracey.morgan@nhs.uk'
        WHEN 3 THEN 'gary.henderson@nhs.uk'
        ELSE 'nicola.fisher@nhs.uk'
    END,
    'SUPP' || lpad(gs::text, 5, '0'),
    CASE gs % 3
        WHEN 0 THEN 'female'
        WHEN 1 THEN 'male'
        ELSE 'female'
    END,
    CASE gs % 6
        WHEN 0 THEN 'Berkshire Healthcare NHS Foundation Trust'
        WHEN 1 THEN 'Solent NHS Trust'
        WHEN 2 THEN 'Sussex Partnership NHS Foundation Trust'
        WHEN 3 THEN 'Kent and Medway NHS and Social Care Partnership Trust'
        WHEN 4 THEN 'Hertfordshire Partnership University NHS Foundation Trust'
        ELSE 'Essex Partnership University NHS Foundation Trust'
    END,
    '2169',
    'Mental Health Support Worker',
    'Skills for Health',
    CASE gs % 3
        WHEN 0 THEN 'Mental Health Support Worker'
        WHEN 1 THEN 'Care Coordinator'
        ELSE 'Community Support Worker'
    END,
    (SELECT id FROM sample_teams WHERE rn = ((gs - 1) % 7) + 1)
FROM generate_series(1, 16) AS gs

UNION ALL

-- Pharmacists
SELECT 
    CASE gs % 6
        WHEN 1 THEN 'Dr. Helen Clark'
        WHEN 2 THEN 'Dr. Mark Taylor'
        WHEN 3 THEN 'Dr. Susan Miller'
        WHEN 4 THEN 'Dr. Anthony Wright'
        WHEN 5 THEN 'Dr. Caroline Hunt'
        ELSE 'Dr. Jonathan Reed'
    END,
    true,
    ('1976-01-01'::date + (gs * INTERVAL '250 days'))::date,
    CASE gs % 3
        WHEN 0 THEN 'helen.clark@nhs.uk'
        WHEN 1 THEN 'mark.taylor@nhs.uk'
        ELSE 'susan.miller@nhs.uk'
    END,
    'PHARM' || lpad(gs::text, 4, '0'),
    CASE gs % 3
        WHEN 0 THEN 'female'
        WHEN 1 THEN 'male'
        ELSE 'female'
    END,
    CASE gs % 3
        WHEN 0 THEN 'Guy''s and St Thomas'' NHS Foundation Trust'
        WHEN 1 THEN 'King''s College Hospital NHS Foundation Trust'
        ELSE 'University College London Hospitals NHS Foundation Trust'
    END,
    '2231',
    'Clinical Pharmacist',
    'General Pharmaceutical Council',
    'Mental Health Pharmacist',
    (SELECT id FROM sample_teams WHERE rn = ((gs - 1) % 3) + 1)
FROM generate_series(1, 6) AS gs;