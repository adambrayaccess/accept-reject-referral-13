-- Link GP details to patients
-- This migration will randomly assign GP details to patients for demonstration purposes

-- First, get a list of patient IDs and GP detail IDs
WITH patient_list AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as patient_row_num
  FROM patients
  LIMIT 20  -- Link first 20 patients to GP details
),
gp_list AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as gp_row_num  
  FROM gp_details
  WHERE patient_id IS NULL
)
UPDATE gp_details 
SET patient_id = (
  SELECT p.id 
  FROM patient_list p 
  WHERE p.patient_row_num = (
    SELECT g.gp_row_num 
    FROM gp_list g 
    WHERE g.id = gp_details.id
  )
)
WHERE id IN (SELECT id FROM gp_list);

-- Add some additional GP details for remaining patients without GPs
INSERT INTO gp_details (patient_id, name, practice, address, phone, email)
SELECT 
  p.id,
  CASE 
    WHEN (ROW_NUMBER() OVER ()) % 5 = 0 THEN 'Dr. Mary Robinson'
    WHEN (ROW_NUMBER() OVER ()) % 5 = 1 THEN 'Dr. John Campbell'  
    WHEN (ROW_NUMBER() OVER ()) % 5 = 2 THEN 'Dr. Angela Foster'
    WHEN (ROW_NUMBER() OVER ()) % 5 = 3 THEN 'Dr. Peter Mitchell'
    ELSE 'Dr. Catherine Lewis'
  END as name,
  CASE 
    WHEN (ROW_NUMBER() OVER ()) % 5 = 0 THEN 'Unity Health Practice'
    WHEN (ROW_NUMBER() OVER ()) % 5 = 1 THEN 'Community Care Centre'
    WHEN (ROW_NUMBER() OVER ()) % 5 = 2 THEN 'Valley Medical Group'
    WHEN (ROW_NUMBER() OVER ()) % 5 = 3 THEN 'Harbor Family Practice'
    ELSE 'Wellness Medical Centre'
  END as practice,
  CASE 
    WHEN (ROW_NUMBER() OVER ()) % 5 = 0 THEN '123 Unity Avenue, London, W1A 0AA'
    WHEN (ROW_NUMBER() OVER ()) % 5 = 1 THEN '456 Community Road, Manchester, M1 1AA'
    WHEN (ROW_NUMBER() OVER ()) % 5 = 2 THEN '789 Valley Street, Birmingham, B1 1AA'
    WHEN (ROW_NUMBER() OVER ()) % 5 = 3 THEN '321 Harbor Lane, Liverpool, L1 1AA'
    ELSE '654 Wellness Drive, Leeds, LS1 1AA'
  END as address,
  CASE 
    WHEN (ROW_NUMBER() OVER ()) % 5 = 0 THEN '020 8123 4567'
    WHEN (ROW_NUMBER() OVER ()) % 5 = 1 THEN '0161 234 5678'
    WHEN (ROW_NUMBER() OVER ()) % 5 = 2 THEN '0121 345 6789'
    WHEN (ROW_NUMBER() OVER ()) % 5 = 3 THEN '0151 456 7890'
    ELSE '0113 567 8901'
  END as phone,
  CASE 
    WHEN (ROW_NUMBER() OVER ()) % 5 = 0 THEN 'admin@unity-health.nhs.uk'
    WHEN (ROW_NUMBER() OVER ()) % 5 = 1 THEN 'reception@community-care.nhs.uk'
    WHEN (ROW_NUMBER() OVER ()) % 5 = 2 THEN 'enquiries@valley-medical.nhs.uk'
    WHEN (ROW_NUMBER() OVER ()) % 5 = 3 THEN 'admin@harbor-family.nhs.uk'
    ELSE 'reception@wellness-medical.nhs.uk'
  END as email
FROM patients p
WHERE p.id NOT IN (
  SELECT patient_id FROM gp_details WHERE patient_id IS NOT NULL
)
LIMIT 50;