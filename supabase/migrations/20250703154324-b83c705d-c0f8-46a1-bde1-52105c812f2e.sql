-- Generate sample historic addresses data for patients
-- Get patient IDs to work with
WITH sample_patients AS (
    SELECT id FROM public.patients 
    WHERE active = true 
    LIMIT 25
),
patient_list AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn FROM sample_patients
)

-- Insert historic addresses for patients
INSERT INTO public.historic_addresses (
    patient_id, 
    address, 
    date_from, 
    date_to, 
    address_type
) 
-- Previous residential addresses
SELECT 
    p.id,
    CASE p.rn
        WHEN 1 THEN '45 Oak Street, London, W1A 2BB'
        WHEN 2 THEN '12 Elm Road, Manchester, M1 3CC'
        WHEN 3 THEN '78 Pine Avenue, Edinburgh, EH2 4DD'
        WHEN 4 THEN '23 Birch Close, Cardiff, CF1 5EE'
        WHEN 5 THEN '56 Maple Drive, Birmingham, B3 6FF'
        WHEN 6 THEN '91 Cedar Lane, Leeds, LS4 7GG'
        WHEN 7 THEN '34 Willow Court, Glasgow, G5 8HH'
        WHEN 8 THEN '67 Ash Gardens, Newcastle, NE6 9JJ'
        WHEN 9 THEN '89 Beech Street, Bristol, BS7 0KK'
        WHEN 10 THEN '12 Poplar Road, Liverpool, L8 1LL'
        WHEN 11 THEN '45 Cherry Avenue, Sheffield, S9 2MM'
        WHEN 12 THEN '78 Hazel Close, Leicester, LE10 3NN'
        WHEN 13 THEN '23 Rowan Drive, Nottingham, NG11 4PP'
        WHEN 14 THEN '56 Chestnut Lane, Coventry, CV12 5QQ'
        WHEN 15 THEN '91 Sycamore Court, Hull, HU13 6RR'
        WHEN 16 THEN '34 Lime Street, Plymouth, PL14 7SS'
        WHEN 17 THEN '67 Hornbeam Road, Stoke, ST15 8TT'
        WHEN 18 THEN '89 Laurel Gardens, Derby, DE16 9UU'
        WHEN 19 THEN '12 Magnolia Avenue, Southampton, SO17 0VV'
        WHEN 20 THEN '45 Plane Close, Portsmouth, PO18 1WW'
        WHEN 21 THEN '78 Cypress Drive, Brighton, BN19 2XX'
        WHEN 22 THEN '23 Redwood Lane, Bournemouth, BH20 3YY'
        WHEN 23 THEN '56 Fir Court, Reading, RG21 4ZZ'
        WHEN 24 THEN '91 Spruce Street, Oxford, OX22 5AA'
        WHEN 25 THEN '34 Larch Road, Cambridge, CB23 6BB'
        ELSE '1 Sample Street, London, E1 1AA'
    END,
    (CURRENT_DATE - INTERVAL '5 years') + (INTERVAL '1 month' * (p.rn - 1)),
    (CURRENT_DATE - INTERVAL '2 years') + (INTERVAL '2 weeks' * (p.rn - 1)),
    'residential'
FROM patient_list p

UNION ALL

-- Temporary addresses (for some patients)
SELECT 
    p.id,
    CASE p.rn
        WHEN 1 THEN '10 Temporary Housing, London, SW1 9XX'
        WHEN 3 THEN '22 Sheltered Accommodation, Edinburgh, EH8 0YY'
        WHEN 5 THEN '15 Student Halls, Birmingham, B15 2ZZ'
        WHEN 7 THEN '8 Care Home, Glasgow, G12 3AA'
        WHEN 9 THEN '33 Respite Care, Bristol, BS1 4BB'
        WHEN 11 THEN '27 Rehabilitation Centre, Sheffield, S1 5CC'
        WHEN 13 THEN '19 Supported Living, Nottingham, NG1 6DD'
        WHEN 15 THEN '41 Hostel Address, Hull, HU1 7EE'
        WHEN 17 THEN '52 Refuge Address, Stoke, ST1 8FF'
        WHEN 19 THEN '7 Temporary Flat, Southampton, SO14 9GG'
        ELSE '99 Temp Address, City, XX1 0HH'
    END,
    (CURRENT_DATE - INTERVAL '18 months') + (INTERVAL '3 weeks' * (p.rn - 1)),
    (CURRENT_DATE - INTERVAL '6 months') + (INTERVAL '1 week' * (p.rn - 1)),
    'temporary'
FROM patient_list p
WHERE p.rn % 2 = 1 AND p.rn <= 20  -- Every other patient up to 20

UNION ALL

-- Correspondence addresses (for a few patients)
SELECT 
    p.id,
    CASE p.rn
        WHEN 2 THEN 'c/o Family Member, 88 Family Street, Manchester, M50 1XX'
        WHEN 6 THEN 'PO Box 123, Leeds Post Office, Leeds, LS99 2YY'
        WHEN 10 THEN 'c/o Social Services, Civic Centre, Liverpool, L1 3ZZ'
        WHEN 14 THEN 'c/o Legal Guardian, Law Chambers, Coventry, CV1 4AA'
        WHEN 18 THEN 'c/o Power of Attorney, Office Building, Derby, DE1 5BB'
        WHEN 22 THEN 'c/o Care Coordinator, Health Centre, Bournemouth, BH1 6CC'
        ELSE 'c/o Contact, Building, City, XX1 0DD'
    END,
    (CURRENT_DATE - INTERVAL '3 years') + (INTERVAL '2 months' * (p.rn - 1)),
    (CURRENT_DATE - INTERVAL '1 year') + (INTERVAL '1 month' * (p.rn - 1)),
    'correspondence'
FROM patient_list p
WHERE p.rn % 4 = 2 AND p.rn <= 24;  -- Every fourth patient starting from 2