-- Generate sample related people data for existing patients
-- Get some patient IDs to work with
WITH sample_patients AS (
    SELECT id FROM public.patients 
    WHERE active = true 
    LIMIT 8
),
patient_list AS (
    SELECT id, ROW_NUMBER() OVER () as rn FROM sample_patients
)

-- Insert various types of related people
INSERT INTO public.related_people (
    patient_id, 
    name, 
    relationship, 
    phone, 
    email, 
    address,
    is_primary_contact,
    is_next_of_kin,
    is_emergency_contact
) 
-- Spouses/Partners (Primary contacts and next of kin)
SELECT 
    p.id,
    CASE p.rn
        WHEN 1 THEN 'Sarah Johnson'
        WHEN 2 THEN 'David Williams'
        WHEN 3 THEN 'Emma Thompson'
        WHEN 4 THEN 'Michael Brown'
        ELSE 'Partner Name'
    END,
    'Spouse',
    CASE p.rn
        WHEN 1 THEN '020 7123 4567'
        WHEN 2 THEN '0161 234 5678'
        WHEN 3 THEN '0131 345 6789'
        WHEN 4 THEN '029 2456 7890'
        ELSE '020 7000 0000'
    END,
    CASE p.rn
        WHEN 1 THEN 'sarah.johnson@email.com'
        WHEN 2 THEN 'david.williams@email.com'
        WHEN 3 THEN 'emma.thompson@email.com'
        WHEN 4 THEN 'michael.brown@email.com'
        ELSE 'partner@email.com'
    END,
    CASE p.rn
        WHEN 1 THEN '12 Oak Street, London, W1A 1AA'
        WHEN 2 THEN '45 Pine Road, Manchester, M1 2BB'
        WHEN 3 THEN '78 Elm Avenue, Edinburgh, EH1 3CC'
        WHEN 4 THEN '91 Birch Lane, Cardiff, CF1 4DD'
        ELSE '1 Main Street, London, E1 1AA'
    END,
    true,  -- is_primary_contact
    true,  -- is_next_of_kin
    true   -- is_emergency_contact
FROM patient_list p
WHERE p.rn <= 4

UNION ALL

-- Adult Children (Emergency contacts)
SELECT 
    p.id,
    CASE p.rn
        WHEN 1 THEN 'James Johnson'
        WHEN 2 THEN 'Lucy Williams'
        WHEN 3 THEN 'Tom Thompson'
        WHEN 5 THEN 'Rachel Davis'
        ELSE 'Child Name'
    END,
    'Son/Daughter',
    CASE p.rn
        WHEN 1 THEN '07123 456789'
        WHEN 2 THEN '07234 567890'
        WHEN 3 THEN '07345 678901'
        WHEN 5 THEN '07456 789012'
        ELSE '07000 000000'
    END,
    CASE p.rn
        WHEN 1 THEN 'james.johnson@email.com'
        WHEN 2 THEN 'lucy.williams@email.com'
        WHEN 3 THEN 'tom.thompson@email.com'
        WHEN 5 THEN 'rachel.davis@email.com'
        ELSE 'child@email.com'
    END,
    NULL, -- Different address
    false, -- is_primary_contact
    false, -- is_next_of_kin
    true   -- is_emergency_contact
FROM patient_list p
WHERE p.rn IN (1, 2, 3, 5)

UNION ALL

-- Parents (Next of kin for younger patients)
SELECT 
    p.id,
    CASE p.rn
        WHEN 6 THEN 'Margaret Wilson'
        WHEN 7 THEN 'Robert Taylor'
        ELSE 'Parent Name'
    END,
    'Mother/Father',
    CASE p.rn
        WHEN 6 THEN '020 8123 4567'
        WHEN 7 THEN '0113 234 5678'
        ELSE '020 8000 0000'
    END,
    CASE p.rn
        WHEN 6 THEN 'margaret.wilson@email.com'
        WHEN 7 THEN 'robert.taylor@email.com'
        ELSE 'parent@email.com'
    END,
    CASE p.rn
        WHEN 6 THEN '56 Maple Drive, London, SW2 5EE'
        WHEN 7 THEN '23 Cedar Close, Leeds, LS1 6FF'
        ELSE '2 Family Street, London, E2 2BB'
    END,
    true,  -- is_primary_contact
    true,  -- is_next_of_kin
    true   -- is_emergency_contact
FROM patient_list p
WHERE p.rn IN (6, 7)

UNION ALL

-- Siblings (Emergency contacts only)
SELECT 
    p.id,
    CASE p.rn
        WHEN 2 THEN 'Lisa Williams'
        WHEN 4 THEN 'John Brown'
        WHEN 8 THEN 'Kate Anderson'
        ELSE 'Sibling Name'
    END,
    'Sister/Brother',
    CASE p.rn
        WHEN 2 THEN '07987 654321'
        WHEN 4 THEN '07876 543210'
        WHEN 8 THEN '07765 432109'
        ELSE '07000 111111'
    END,
    CASE p.rn
        WHEN 2 THEN 'lisa.williams@email.com'
        WHEN 4 THEN 'john.brown@email.com'
        WHEN 8 THEN 'kate.anderson@email.com'
        ELSE 'sibling@email.com'
    END,
    NULL, -- Different address
    false, -- is_primary_contact
    false, -- is_next_of_kin
    true   -- is_emergency_contact
FROM patient_list p
WHERE p.rn IN (2, 4, 8)

UNION ALL

-- Close Friends (Emergency contacts for patients without family)
SELECT 
    p.id,
    CASE p.rn
        WHEN 3 THEN 'Helen Clarke'
        WHEN 5 THEN 'Peter Mitchell'
        ELSE 'Friend Name'
    END,
    'Close Friend',
    CASE p.rn
        WHEN 3 THEN '07654 321098'
        WHEN 5 THEN '07543 210987'
        ELSE '07000 222222'
    END,
    CASE p.rn
        WHEN 3 THEN 'helen.clarke@email.com'
        WHEN 5 THEN 'peter.mitchell@email.com'
        ELSE 'friend@email.com'
    END,
    NULL, -- Different address
    false, -- is_primary_contact
    false, -- is_next_of_kin
    true   -- is_emergency_contact
FROM patient_list p
WHERE p.rn IN (3, 5)

UNION ALL

-- Care Home Contact (for elderly patients)
SELECT 
    p.id,
    'Sunny Meadows Care Home',
    'Care Provider',
    '020 7890 1234',
    'contact@sunnymeadows.care',
    '15 Garden View, London, N1 7GG',
    false, -- is_primary_contact
    false, -- is_next_of_kin
    true   -- is_emergency_contact
FROM patient_list p
WHERE p.rn = 1

UNION ALL

-- Guardian (for younger patients)
SELECT 
    p.id,
    'Social Services Guardian',
    'Legal Guardian',
    '020 7111 2222',
    'guardian@socialservices.gov.uk',
    'Social Services Dept, Civic Centre, London, SW1 8AA',
    false, -- is_primary_contact
    true,  -- is_next_of_kin
    true   -- is_emergency_contact
FROM patient_list p
WHERE p.rn = 6;