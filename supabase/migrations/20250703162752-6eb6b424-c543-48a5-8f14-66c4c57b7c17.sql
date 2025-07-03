-- Generate sample MHA sections data for patients
-- Get patient IDs to work with
WITH sample_patients AS (
    SELECT id FROM public.patients 
    WHERE active = true 
    LIMIT 15
),
patient_list AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn FROM sample_patients
)

-- Insert MHA sections for patients
INSERT INTO public.mha_sections (
    patient_id,
    section_number,
    section_title,
    applied_date,
    expiry_date,
    status,
    consultant_responsible,
    hospital,
    reason,
    review_date,
    notes
)
-- Current active sections
SELECT 
    p.id,
    CASE p.rn % 5
        WHEN 0 THEN '3'
        WHEN 1 THEN '2'
        WHEN 2 THEN '5(2)'
        WHEN 3 THEN '4'
        ELSE '136'
    END,
    CASE p.rn % 5
        WHEN 0 THEN 'Admission for Treatment'
        WHEN 1 THEN 'Admission for Assessment'
        WHEN 2 THEN 'Doctor''s Holding Power'
        WHEN 3 THEN 'Admission for Assessment in Emergency'
        ELSE 'Mentally Disordered Offenders'
    END,
    (CURRENT_DATE - INTERVAL '45 days' + (p.rn * INTERVAL '3 days'))::timestamp with time zone,
    CASE p.rn % 5
        WHEN 0 THEN (CURRENT_DATE + INTERVAL '135 days' + (p.rn * INTERVAL '3 days'))::timestamp with time zone
        WHEN 1 THEN (CURRENT_DATE + INTERVAL '15 days' + (p.rn * INTERVAL '2 days'))::timestamp with time zone
        WHEN 2 THEN (CURRENT_DATE - INTERVAL '10 days' + (p.rn * INTERVAL '1 day'))::timestamp with time zone
        WHEN 3 THEN (CURRENT_DATE + INTERVAL '25 days' + (p.rn * INTERVAL '2 days'))::timestamp with time zone
        ELSE NULL
    END,
    CASE p.rn % 5
        WHEN 0 THEN 'active'::mha_status
        WHEN 1 THEN 'active'::mha_status  
        WHEN 2 THEN 'expired'::mha_status
        WHEN 3 THEN 'active'::mha_status
        ELSE 'active'::mha_status
    END,
    CASE p.rn % 6
        WHEN 0 THEN 'Dr. Emma Clarke'
        WHEN 1 THEN 'Dr. Michael Thompson'
        WHEN 2 THEN 'Dr. Sarah Williams'
        WHEN 3 THEN 'Dr. James Anderson'
        WHEN 4 THEN 'Dr. Rachel Green'
        ELSE 'Dr. David Chen'
    END,
    CASE p.rn % 8
        WHEN 0 THEN 'Manchester Mental Health Trust'
        WHEN 1 THEN 'Birmingham Community Healthcare NHS Trust'
        WHEN 2 THEN 'Leeds Mental Health Services'
        WHEN 3 THEN 'Sheffield Health and Social Care NHS Trust'
        WHEN 4 THEN 'Newcastle Mental Health Unit'
        WHEN 5 THEN 'Bristol Mental Health Foundation'
        WHEN 6 THEN 'Liverpool Psychiatric Hospital'
        ELSE 'Cardiff Mental Health Services'
    END,
    CASE p.rn % 5
        WHEN 0 THEN 'Severe depression with psychotic features. Patient lacks capacity to consent to treatment and poses significant risk of self-harm.'
        WHEN 1 THEN 'Initial presentation with acute psychotic symptoms and agitation. Assessment required to determine appropriate treatment pathway.'
        WHEN 2 THEN 'Patient attempted to leave ward during voluntary admission while experiencing acute psychotic episode.'
        WHEN 3 THEN 'Emergency admission following police involvement. Patient displaying severe mental disturbance requiring immediate assessment.'
        ELSE 'Court-ordered assessment following criminal proceedings. Mental health issues contributing to offending behaviour.'
    END,
    CASE p.rn % 5
        WHEN 0 THEN (CURRENT_DATE + INTERVAL '30 days' + (p.rn * INTERVAL '7 days'))::timestamp with time zone
        WHEN 1 THEN (CURRENT_DATE + INTERVAL '14 days' + (p.rn * INTERVAL '3 days'))::timestamp with time zone
        WHEN 2 THEN NULL
        WHEN 3 THEN (CURRENT_DATE + INTERVAL '14 days' + (p.rn * INTERVAL '2 days'))::timestamp with time zone
        ELSE (CURRENT_DATE + INTERVAL '60 days' + (p.rn * INTERVAL '14 days'))::timestamp with time zone
    END,
    CASE p.rn % 5
        WHEN 0 THEN 'Patient showing gradual improvement with antipsychotic medication. Regular review meetings with family.'
        WHEN 1 THEN 'Comprehensive assessment completed. Considering transfer to Section 3 for ongoing treatment.'
        WHEN 2 THEN 'Used to prevent patient leaving until formal assessment could be arranged. Patient subsequently agreed to remain voluntarily.'
        WHEN 3 THEN 'Emergency powers used appropriately. Full assessment in progress.'
        ELSE 'Regular psychiatric reports provided to court. Treatment plan coordinated with probation services.'
    END
FROM patient_list p
WHERE p.rn <= 8

UNION ALL

-- Historical expired sections
SELECT 
    p.id,
    CASE p.rn % 4
        WHEN 0 THEN '2'
        WHEN 1 THEN '5(4)'
        WHEN 2 THEN '3'
        ELSE '17'
    END,
    CASE p.rn % 4
        WHEN 0 THEN 'Admission for Assessment'
        WHEN 1 THEN 'Nurse''s Holding Power'
        WHEN 2 THEN 'Admission for Treatment'
        ELSE 'Leave of Absence'
    END,
    (CURRENT_DATE - INTERVAL '180 days' + (p.rn * INTERVAL '10 days'))::timestamp with time zone,
    (CURRENT_DATE - INTERVAL '150 days' + (p.rn * INTERVAL '8 days'))::timestamp with time zone,
    CASE p.rn % 3
        WHEN 0 THEN 'expired'::mha_status
        WHEN 1 THEN 'discharged'::mha_status
        ELSE 'expired'::mha_status
    END,
    CASE p.rn % 5
        WHEN 0 THEN 'Dr. Helen Roberts'
        WHEN 1 THEN 'Dr. Peter Collins'
        WHEN 2 THEN 'Dr. Anna Mitchell'
        WHEN 3 THEN 'Dr. John Phillips'
        ELSE 'Dr. Lisa Turner'
    END,
    CASE p.rn % 6
        WHEN 0 THEN 'Greater Manchester Mental Health NHS Trust'
        WHEN 1 THEN 'South London and Maudsley NHS Trust'
        WHEN 2 THEN 'Mersey Care NHS Trust'
        WHEN 3 THEN 'Tees, Esk and Wear Valleys NHS Trust'
        WHEN 4 THEN 'West London Mental Health NHS Trust'
        ELSE 'East London NHS Foundation Trust'
    END,
    CASE p.rn % 4
        WHEN 0 THEN 'Patient presented with acute anxiety and depressive symptoms requiring assessment.'
        WHEN 1 THEN 'Nursing staff intervention to prevent patient leaving during mental health crisis.'
        WHEN 2 THEN 'Treatment for bipolar disorder with manic episodes. Patient responded well to medication.'
        ELSE 'Structured leave program as part of rehabilitation process back to community.'
    END,
    NULL,
    CASE p.rn % 4
        WHEN 0 THEN 'Assessment completed successfully. Patient discharged to community mental health team.'
        WHEN 1 THEN 'Brief holding power exercised appropriately. Patient calmed and agreed to remain for assessment.'
        WHEN 2 THEN 'Treatment completed successfully. Patient achieved stability and discharged home.'
        ELSE 'Leave program successful. Patient transitioned to outpatient care.'
    END
FROM patient_list p
WHERE p.rn BETWEEN 3 AND 10

UNION ALL

-- Additional discharged sections for some patients
SELECT 
    p.id,
    CASE p.rn % 3
        WHEN 0 THEN '5(2)'
        WHEN 1 THEN '2'
        ELSE '3'
    END,
    CASE p.rn % 3
        WHEN 0 THEN 'Doctor''s Holding Power'
        WHEN 1 THEN 'Admission for Assessment'  
        ELSE 'Admission for Treatment'
    END,
    (CURRENT_DATE - INTERVAL '300 days' + (p.rn * INTERVAL '15 days'))::timestamp with time zone,
    CASE p.rn % 3
        WHEN 0 THEN (CURRENT_DATE - INTERVAL '297 days' + (p.rn * INTERVAL '15 days'))::timestamp with time zone
        WHEN 1 THEN (CURRENT_DATE - INTERVAL '272 days' + (p.rn * INTERVAL '12 days'))::timestamp with time zone
        ELSE (CURRENT_DATE - INTERVAL '120 days' + (p.rn * INTERVAL '8 days'))::timestamp with time zone
    END,
    'discharged'::mha_status,
    CASE p.rn % 4
        WHEN 0 THEN 'Dr. Mark Wilson'
        WHEN 1 THEN 'Dr. Catherine Jones'
        WHEN 2 THEN 'Dr. Robert Brown'
        ELSE 'Dr. Jennifer Davis'
    END,
    CASE p.rn % 5
        WHEN 0 THEN 'Oxleas NHS Foundation Trust'
        WHEN 1 THEN 'Camden and Islington NHS Foundation Trust'
        WHEN 2 THEN 'Nottinghamshire Healthcare NHS Trust'
        WHEN 3 THEN 'Derbyshire Healthcare NHS Foundation Trust'
        ELSE 'Leicestershire Partnership NHS Trust'
    END,
    CASE p.rn % 3
        WHEN 0 THEN 'Emergency intervention during crisis episode. Patient stabilized quickly.'
        WHEN 1 THEN 'Routine assessment for recurring mental health issues. Treatment plan adjusted.'
        ELSE 'Long-term treatment for chronic condition. Significant improvement achieved.'
    END,
    NULL,
    CASE p.rn % 3
        WHEN 0 THEN 'Crisis resolved quickly. Patient returned to usual place of residence with community support.'
        WHEN 1 THEN 'Assessment complete. New medication regimen established. Regular outpatient follow-up arranged.'
        ELSE 'Successful treatment outcome. Patient achieved independent living with minimal support requirements.'
    END
FROM patient_list p
WHERE p.rn BETWEEN 1 AND 6;