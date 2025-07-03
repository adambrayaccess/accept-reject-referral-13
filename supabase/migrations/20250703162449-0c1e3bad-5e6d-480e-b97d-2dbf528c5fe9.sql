-- Generate sample medication data for patients
-- Get patient IDs to work with
WITH sample_patients AS (
    SELECT id FROM public.patients 
    WHERE active = true 
    LIMIT 20
),
patient_list AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn FROM sample_patients
)

-- Insert medications for patients
INSERT INTO public.medications (
    patient_id, 
    name, 
    dosage, 
    frequency, 
    prescribed_date, 
    prescribed_by, 
    indication, 
    status, 
    notes
) 
-- Hypertension medications
SELECT 
    p.id,
    CASE p.rn % 4
        WHEN 0 THEN 'Amlodipine'
        WHEN 1 THEN 'Lisinopril'
        WHEN 2 THEN 'Ramipril'
        ELSE 'Atenolol'
    END,
    CASE p.rn % 4
        WHEN 0 THEN '5mg'
        WHEN 1 THEN '10mg'
        WHEN 2 THEN '2.5mg'
        ELSE '25mg'
    END,
    CASE p.rn % 4
        WHEN 0 THEN 'Once daily'
        WHEN 1 THEN 'Once daily'
        WHEN 2 THEN 'Once daily'
        ELSE 'Once daily'
    END,
    (CURRENT_DATE - INTERVAL '30 days' + (p.rn * INTERVAL '2 days'))::timestamp with time zone,
    CASE p.rn % 3
        WHEN 0 THEN 'Dr. Sarah Mitchell'
        WHEN 1 THEN 'Dr. James Wilson'
        ELSE 'Dr. Emma Thompson'
    END,
    'Hypertension',
    'active'::medication_status,
    CASE p.rn % 4
        WHEN 0 THEN 'Monitor for ankle swelling'
        WHEN 1 THEN 'Monitor blood pressure monthly'
        WHEN 2 THEN 'Monitor kidney function'
        ELSE 'Check heart rate regularly'
    END
FROM patient_list p
WHERE p.rn <= 10

UNION ALL

-- Diabetes medications
SELECT 
    p.id,
    CASE p.rn % 3
        WHEN 0 THEN 'Metformin'
        WHEN 1 THEN 'Gliclazide'
        ELSE 'Insulin Glargine'
    END,
    CASE p.rn % 3
        WHEN 0 THEN '500mg'
        WHEN 1 THEN '80mg'
        ELSE '20 units'
    END,
    CASE p.rn % 3
        WHEN 0 THEN 'Twice daily with meals'
        WHEN 1 THEN 'Once daily with breakfast'
        ELSE 'Once daily at bedtime'
    END,
    (CURRENT_DATE - INTERVAL '45 days' + (p.rn * INTERVAL '3 days'))::timestamp with time zone,
    CASE p.rn % 3
        WHEN 0 THEN 'Dr. Michael Brown'
        WHEN 1 THEN 'Dr. Lisa Garcia'
        ELSE 'Dr. David Chen'
    END,
    'Type 2 Diabetes',
    'active'::medication_status,
    CASE p.rn % 3
        WHEN 0 THEN 'Take with food to reduce GI side effects'
        WHEN 1 THEN 'Monitor blood glucose levels'
        ELSE 'Rotate injection sites'
    END
FROM patient_list p
WHERE p.rn BETWEEN 6 AND 15

UNION ALL

-- Mental health medications
SELECT 
    p.id,
    CASE p.rn % 4
        WHEN 0 THEN 'Sertraline'
        WHEN 1 THEN 'Fluoxetine'
        WHEN 2 THEN 'Lorazepam'
        ELSE 'Diazepam'
    END,
    CASE p.rn % 4
        WHEN 0 THEN '50mg'
        WHEN 1 THEN '20mg'
        WHEN 2 THEN '1mg'
        ELSE '2mg'
    END,
    CASE p.rn % 4
        WHEN 0 THEN 'Once daily in morning'
        WHEN 1 THEN 'Once daily in morning'
        WHEN 2 THEN 'As needed, max twice daily'
        ELSE 'Twice daily'
    END,
    (CURRENT_DATE - INTERVAL '60 days' + (p.rn * INTERVAL '4 days'))::timestamp with time zone,
    CASE p.rn % 3
        WHEN 0 THEN 'Dr. Michael Thompson'
        WHEN 1 THEN 'Dr. Rachel Green'
        ELSE 'Dr. Alex Rodriguez'
    END,
    CASE p.rn % 4
        WHEN 0 THEN 'Depression and anxiety'
        WHEN 1 THEN 'Depression'
        WHEN 2 THEN 'Acute anxiety episodes'
        ELSE 'Anxiety disorder'
    END,
    CASE p.rn % 4
        WHEN 2 THEN 'active'::medication_status
        WHEN 3 THEN 'discontinued'::medication_status
        ELSE 'active'::medication_status
    END,
    CASE p.rn % 4
        WHEN 0 THEN 'Monitor for side effects in first 2 weeks'
        WHEN 1 THEN 'Take in morning to avoid sleep disturbance'
        WHEN 2 THEN 'Short-term use only. Review weekly'
        ELSE 'Gradually reduce dose when discontinuing'
    END
FROM patient_list p
WHERE p.rn BETWEEN 3 AND 12

UNION ALL

-- Pain relief medications
SELECT 
    p.id,
    CASE p.rn % 5
        WHEN 0 THEN 'Paracetamol'
        WHEN 1 THEN 'Ibuprofen'
        WHEN 2 THEN 'Codeine'
        WHEN 3 THEN 'Naproxen'
        ELSE 'Tramadol'
    END,
    CASE p.rn % 5
        WHEN 0 THEN '500mg'
        WHEN 1 THEN '400mg'
        WHEN 2 THEN '30mg'
        WHEN 3 THEN '250mg'
        ELSE '50mg'
    END,
    CASE p.rn % 5
        WHEN 0 THEN 'Up to 4 times daily'
        WHEN 1 THEN 'Three times daily with food'
        WHEN 2 THEN 'Every 4-6 hours as needed'
        WHEN 3 THEN 'Twice daily with food'
        ELSE 'Every 4-6 hours as needed'
    END,
    (CURRENT_DATE - INTERVAL '15 days' + (p.rn * INTERVAL '1 day'))::timestamp with time zone,
    CASE p.rn % 4
        WHEN 0 THEN 'Dr. Sophie Williams'
        WHEN 1 THEN 'Dr. Robert Johnson'
        WHEN 2 THEN 'Dr. Maria Santos'
        ELSE 'Dr. Kevin O''Connor'
    END,
    CASE p.rn % 5
        WHEN 0 THEN 'General pain relief'
        WHEN 1 THEN 'Inflammatory pain'
        WHEN 2 THEN 'Moderate pain'
        WHEN 3 THEN 'Arthritis pain'
        ELSE 'Chronic pain'
    END,
    CASE p.rn % 5
        WHEN 2 THEN 'completed'::medication_status
        WHEN 4 THEN 'discontinued'::medication_status
        ELSE 'active'::medication_status
    END,
    CASE p.rn % 5
        WHEN 0 THEN 'Do not exceed 4g per day'
        WHEN 1 THEN 'Take with food to protect stomach'
        WHEN 2 THEN 'Monitor for constipation'
        WHEN 3 THEN 'Regular blood pressure monitoring'
        ELSE 'Review pain levels regularly'
    END
FROM patient_list p
WHERE p.rn BETWEEN 1 AND 18

UNION ALL

-- Cholesterol medications
SELECT 
    p.id,
    CASE p.rn % 3
        WHEN 0 THEN 'Atorvastatin'
        WHEN 1 THEN 'Simvastatin'
        ELSE 'Rosuvastatin'
    END,
    CASE p.rn % 3
        WHEN 0 THEN '20mg'
        WHEN 1 THEN '40mg'
        ELSE '10mg'
    END,
    'Once daily at bedtime',
    (CURRENT_DATE - INTERVAL '90 days' + (p.rn * INTERVAL '5 days'))::timestamp with time zone,
    CASE p.rn % 2
        WHEN 0 THEN 'Dr. Catherine Lee'
        ELSE 'Dr. Andrew Davis'
    END,
    'High cholesterol',
    CASE p.rn % 3
        WHEN 1 THEN 'discontinued'::medication_status
        ELSE 'active'::medication_status
    END,
    CASE p.rn % 3
        WHEN 0 THEN 'Monitor liver function tests'
        WHEN 1 THEN 'Discontinued due to muscle pain'
        ELSE 'Monitor for muscle symptoms'
    END
FROM patient_list p
WHERE p.rn BETWEEN 5 AND 16

UNION ALL

-- Contraception and hormonal medications
SELECT 
    p.id,
    CASE p.rn % 3
        WHEN 0 THEN 'Microgynon 30'
        WHEN 1 THEN 'Yasmin'
        ELSE 'Levonorgestrel IUD'
    END,
    CASE p.rn % 3
        WHEN 0 THEN '1 tablet'
        WHEN 1 THEN '1 tablet'
        ELSE 'N/A'
    END,
    CASE p.rn % 3
        WHEN 0 THEN 'Once daily'
        WHEN 1 THEN 'Once daily'
        ELSE 'Fitted device'
    END,
    (CURRENT_DATE - INTERVAL '120 days' + (p.rn * INTERVAL '7 days'))::timestamp with time zone,
    CASE p.rn % 2
        WHEN 0 THEN 'Dr. Jennifer Walsh'
        ELSE 'Dr. Susan Miller'
    END,
    'Contraception',
    'active'::medication_status,
    CASE p.rn % 3
        WHEN 0 THEN 'Take at the same time each day'
        WHEN 1 THEN 'Monitor blood pressure regularly'
        ELSE 'Review annually'
    END
FROM patient_list p
WHERE p.rn BETWEEN 2 AND 8

UNION ALL

-- Respiratory medications
SELECT 
    p.id,
    CASE p.rn % 4
        WHEN 0 THEN 'Salbutamol Inhaler'
        WHEN 1 THEN 'Beclometasone Inhaler'
        WHEN 2 THEN 'Montelukast'
        ELSE 'Prednisolone'
    END,
    CASE p.rn % 4
        WHEN 0 THEN '100mcg per dose'
        WHEN 1 THEN '250mcg per dose'
        WHEN 2 THEN '10mg'
        ELSE '5mg'
    END,
    CASE p.rn % 4
        WHEN 0 THEN '2 puffs as needed'
        WHEN 1 THEN '2 puffs twice daily'
        WHEN 2 THEN 'Once daily in evening'
        ELSE 'Once daily with food'
    END,
    (CURRENT_DATE - INTERVAL '75 days' + (p.rn * INTERVAL '6 days'))::timestamp with time zone,
    CASE p.rn % 3
        WHEN 0 THEN 'Dr. Paul Anderson'
        WHEN 1 THEN 'Dr. Helen Clark'
        ELSE 'Dr. Mark Taylor'
    END,
    CASE p.rn % 4
        WHEN 0 THEN 'Asthma - reliever'
        WHEN 1 THEN 'Asthma - preventer'
        WHEN 2 THEN 'Asthma control'
        ELSE 'Acute asthma exacerbation'
    END,
    CASE p.rn % 4
        WHEN 3 THEN 'completed'::medication_status
        ELSE 'active'::medication_status
    END,
    CASE p.rn % 4
        WHEN 0 THEN 'Rinse mouth after use'
        WHEN 1 THEN 'Use spacer device. Rinse mouth after use'
        WHEN 2 THEN 'Take in evening for optimal effect'
        ELSE 'Short course - do not stop suddenly'
    END
FROM patient_list p
WHERE p.rn BETWEEN 4 AND 14;