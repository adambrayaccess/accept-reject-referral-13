-- Generate sample test results data for patients
-- Get patient IDs to work with
WITH sample_patients AS (
    SELECT id FROM public.patients 
    WHERE active = true 
    LIMIT 20
),
patient_list AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn FROM sample_patients
)

-- Insert test results for patients
INSERT INTO public.test_results (
    patient_id,
    test_name,
    test_type,
    requested_date,
    sample_date,
    report_date,
    requested_by,
    performed_by,
    status,
    results,
    interpretation,
    notes
)
-- Blood tests - Full Blood Count
SELECT 
    p.id,
    'Full Blood Count',
    'blood',
    (CURRENT_DATE - INTERVAL '7 days' + (p.rn * INTERVAL '1 day'))::timestamp with time zone,
    (CURRENT_DATE - INTERVAL '6 days' + (p.rn * INTERVAL '1 day'))::timestamp with time zone,
    (CURRENT_DATE - INTERVAL '5 days' + (p.rn * INTERVAL '1 day'))::timestamp with time zone,
    CASE p.rn % 4
        WHEN 0 THEN 'Dr. Sarah Mitchell'
        WHEN 1 THEN 'Dr. James Wilson'
        WHEN 2 THEN 'Dr. Emma Thompson'
        ELSE 'Dr. Michael Brown'
    END,
    CASE p.rn % 3
        WHEN 0 THEN 'Haematology Lab'
        WHEN 1 THEN 'Pathology Department'
        ELSE 'Clinical Laboratory'
    END,
    'completed'::test_status,
    CASE p.rn % 4
        WHEN 0 THEN jsonb_build_array(
            jsonb_build_object('parameter', 'Haemoglobin', 'value', '14.2', 'unit', 'g/dL', 'referenceRange', '12.0-15.5', 'flag', 'normal'),
            jsonb_build_object('parameter', 'White Cell Count', 'value', '6.8', 'unit', '10^9/L', 'referenceRange', '4.0-11.0', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Platelet Count', 'value', '285', 'unit', '10^9/L', 'referenceRange', '150-450', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Red Cell Count', 'value', '4.6', 'unit', '10^12/L', 'referenceRange', '4.0-5.2', 'flag', 'normal')
        )
        WHEN 1 THEN jsonb_build_array(
            jsonb_build_object('parameter', 'Haemoglobin', 'value', '10.8', 'unit', 'g/dL', 'referenceRange', '12.0-15.5', 'flag', 'low'),
            jsonb_build_object('parameter', 'White Cell Count', 'value', '12.5', 'unit', '10^9/L', 'referenceRange', '4.0-11.0', 'flag', 'high'),
            jsonb_build_object('parameter', 'Platelet Count', 'value', '195', 'unit', '10^9/L', 'referenceRange', '150-450', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Red Cell Count', 'value', '3.8', 'unit', '10^12/L', 'referenceRange', '4.0-5.2', 'flag', 'low')
        )
        WHEN 2 THEN jsonb_build_array(
            jsonb_build_object('parameter', 'Haemoglobin', 'value', '15.1', 'unit', 'g/dL', 'referenceRange', '12.0-15.5', 'flag', 'normal'),
            jsonb_build_object('parameter', 'White Cell Count', 'value', '5.2', 'unit', '10^9/L', 'referenceRange', '4.0-11.0', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Platelet Count', 'value', '485', 'unit', '10^9/L', 'referenceRange', '150-450', 'flag', 'high'),
            jsonb_build_object('parameter', 'Red Cell Count', 'value', '4.9', 'unit', '10^12/L', 'referenceRange', '4.0-5.2', 'flag', 'normal')
        )
        ELSE jsonb_build_array(
            jsonb_build_object('parameter', 'Haemoglobin', 'value', '13.7', 'unit', 'g/dL', 'referenceRange', '12.0-15.5', 'flag', 'normal'),
            jsonb_build_object('parameter', 'White Cell Count', 'value', '8.9', 'unit', '10^9/L', 'referenceRange', '4.0-11.0', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Platelet Count', 'value', '340', 'unit', '10^9/L', 'referenceRange', '150-450', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Red Cell Count', 'value', '4.4', 'unit', '10^12/L', 'referenceRange', '4.0-5.2', 'flag', 'normal')
        )
    END,
    CASE p.rn % 4
        WHEN 0 THEN 'All parameters within normal limits. No further action required.'
        WHEN 1 THEN 'Low haemoglobin and raised white cell count. Suggest iron studies and infection screen.'
        WHEN 2 THEN 'Elevated platelet count. Recommend repeat in 2 weeks and consider haematology referral if persistent.'
        ELSE 'Normal full blood count. Results appropriate for age and gender.'
    END,
    CASE p.rn % 4
        WHEN 0 THEN 'Routine monitoring. Patient stable.'
        WHEN 1 THEN 'Patient reports fatigue. Investigating possible anaemia.'
        WHEN 2 THEN 'Follow-up for previous abnormal platelet count.'
        ELSE 'Pre-operative assessment.'
    END
FROM patient_list p
WHERE p.rn <= 15

UNION ALL

-- Biochemistry tests - Liver Function
SELECT 
    p.id,
    'Liver Function Tests',
    'blood',
    (CURRENT_DATE - INTERVAL '14 days' + (p.rn * INTERVAL '2 days'))::timestamp with time zone,
    (CURRENT_DATE - INTERVAL '13 days' + (p.rn * INTERVAL '2 days'))::timestamp with time zone,
    (CURRENT_DATE - INTERVAL '12 days' + (p.rn * INTERVAL '2 days'))::timestamp with time zone,
    CASE p.rn % 5
        WHEN 0 THEN 'Dr. Lisa Garcia'
        WHEN 1 THEN 'Dr. David Chen'
        WHEN 2 THEN 'Dr. Rachel Green'
        WHEN 3 THEN 'Dr. Alex Rodriguez'
        ELSE 'Dr. Catherine Lee'
    END,
    'Biochemistry Lab',
    'completed'::test_status,
    CASE p.rn % 3
        WHEN 0 THEN jsonb_build_array(
            jsonb_build_object('parameter', 'ALT', 'value', '28', 'unit', 'U/L', 'referenceRange', '7-56', 'flag', 'normal'),
            jsonb_build_object('parameter', 'AST', 'value', '32', 'unit', 'U/L', 'referenceRange', '10-40', 'flag', 'normal'),
            jsonb_build_object('parameter', 'ALP', 'value', '95', 'unit', 'U/L', 'referenceRange', '44-147', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Bilirubin', 'value', '12', 'unit', 'μmol/L', 'referenceRange', '3-17', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Albumin', 'value', '42', 'unit', 'g/L', 'referenceRange', '35-50', 'flag', 'normal')
        )
        WHEN 1 THEN jsonb_build_array(
            jsonb_build_object('parameter', 'ALT', 'value', '78', 'unit', 'U/L', 'referenceRange', '7-56', 'flag', 'high'),
            jsonb_build_object('parameter', 'AST', 'value', '65', 'unit', 'U/L', 'referenceRange', '10-40', 'flag', 'high'),
            jsonb_build_object('parameter', 'ALP', 'value', '165', 'unit', 'U/L', 'referenceRange', '44-147', 'flag', 'high'),
            jsonb_build_object('parameter', 'Bilirubin', 'value', '25', 'unit', 'μmol/L', 'referenceRange', '3-17', 'flag', 'high'),
            jsonb_build_object('parameter', 'Albumin', 'value', '32', 'unit', 'g/L', 'referenceRange', '35-50', 'flag', 'low')
        )
        ELSE jsonb_build_array(
            jsonb_build_object('parameter', 'ALT', 'value', '45', 'unit', 'U/L', 'referenceRange', '7-56', 'flag', 'normal'),
            jsonb_build_object('parameter', 'AST', 'value', '38', 'unit', 'U/L', 'referenceRange', '10-40', 'flag', 'normal'),
            jsonb_build_object('parameter', 'ALP', 'value', '120', 'unit', 'U/L', 'referenceRange', '44-147', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Bilirubin', 'value', '15', 'unit', 'μmol/L', 'referenceRange', '3-17', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Albumin', 'value', '38', 'unit', 'g/L', 'referenceRange', '35-50', 'flag', 'normal')
        )
    END,
    CASE p.rn % 3
        WHEN 0 THEN 'Liver function tests within normal limits. No evidence of hepatic dysfunction.'
        WHEN 1 THEN 'Elevated liver enzymes and bilirubin. Low albumin. Suggest hepatology referral and further investigation.'
        ELSE 'Liver function tests essentially normal. Continue current medications.'
    END,
    CASE p.rn % 3
        WHEN 0 THEN 'Routine monitoring for medication therapy.'
        WHEN 1 THEN 'Patient reports right upper quadrant pain and fatigue.'
        ELSE 'Annual health screening.'
    END
FROM patient_list p
WHERE p.rn BETWEEN 5 AND 18

UNION ALL

-- Urine tests
SELECT 
    p.id,
    CASE p.rn % 3
        WHEN 0 THEN 'Urine Microscopy & Culture'
        WHEN 1 THEN 'Urine Dipstick'
        ELSE 'Urine Protein/Creatinine Ratio'
    END,
    'urine',
    (CURRENT_DATE - INTERVAL '10 days' + (p.rn * INTERVAL '1 day'))::timestamp with time zone,
    (CURRENT_DATE - INTERVAL '9 days' + (p.rn * INTERVAL '1 day'))::timestamp with time zone,
    (CURRENT_DATE - INTERVAL '8 days' + (p.rn * INTERVAL '1 day'))::timestamp with time zone,
    CASE p.rn % 4
        WHEN 0 THEN 'Dr. Sophie Williams'
        WHEN 1 THEN 'Dr. Robert Johnson'
        WHEN 2 THEN 'Dr. Maria Santos'
        ELSE 'Dr. Kevin O''Connor'
    END,
    'Microbiology Lab',
    'completed'::test_status,
    CASE p.rn % 3
        WHEN 0 THEN jsonb_build_array(
            jsonb_build_object('parameter', 'Appearance', 'value', 'Clear', 'unit', '', 'referenceRange', 'Clear', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Leucocytes', 'value', '2', 'unit', '/hpf', 'referenceRange', '<5', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Red Cells', 'value', '1', 'unit', '/hpf', 'referenceRange', '<3', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Bacteria', 'value', 'Nil significant growth', 'unit', '', 'referenceRange', '<10^5 CFU/mL', 'flag', 'normal')
        )
        WHEN 1 THEN jsonb_build_array(
            jsonb_build_object('parameter', 'Protein', 'value', '++', 'unit', '', 'referenceRange', 'Negative', 'flag', 'high'),
            jsonb_build_object('parameter', 'Blood', 'value', '+', 'unit', '', 'referenceRange', 'Negative', 'flag', 'high'),
            jsonb_build_object('parameter', 'Glucose', 'value', 'Negative', 'unit', '', 'referenceRange', 'Negative', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Nitrites', 'value', 'Positive', 'unit', '', 'referenceRange', 'Negative', 'flag', 'high'),
            jsonb_build_object('parameter', 'Leucocyte Esterase', 'value', '++', 'unit', '', 'referenceRange', 'Negative', 'flag', 'high')
        )
        ELSE jsonb_build_array(
            jsonb_build_object('parameter', 'Protein/Creatinine Ratio', 'value', '25', 'unit', 'mg/mmol', 'referenceRange', '<30', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Albumin/Creatinine Ratio', 'value', '8', 'unit', 'mg/mmol', 'referenceRange', '<3.5', 'flag', 'high')
        )
    END,
    CASE p.rn % 3
        WHEN 0 THEN 'Normal urine microscopy and culture. No evidence of urinary tract infection.'
        WHEN 1 THEN 'Positive for urinary tract infection. Protein and blood present. Recommend antibiotic treatment.'
        ELSE 'Elevated albumin/creatinine ratio suggests early diabetic nephropathy. Monitor closely.'
    END,
    CASE p.rn % 3
        WHEN 0 THEN 'Routine screening.'
        WHEN 1 THEN 'Patient reports dysuria and frequency.'
        ELSE 'Diabetic monitoring for renal complications.'
    END
FROM patient_list p
WHERE p.rn BETWEEN 3 AND 15

UNION ALL

-- Imaging studies
SELECT 
    p.id,
    CASE p.rn % 4
        WHEN 0 THEN 'Chest X-Ray'
        WHEN 1 THEN 'Abdominal Ultrasound'
        WHEN 2 THEN 'ECG'
        ELSE 'CT Head'
    END,
    'imaging',
    (CURRENT_DATE - INTERVAL '21 days' + (p.rn * INTERVAL '3 days'))::timestamp with time zone,
    (CURRENT_DATE - INTERVAL '20 days' + (p.rn * INTERVAL '3 days'))::timestamp with time zone,
    (CURRENT_DATE - INTERVAL '19 days' + (p.rn * INTERVAL '3 days'))::timestamp with time zone,
    CASE p.rn % 5
        WHEN 0 THEN 'Dr. Paul Anderson'
        WHEN 1 THEN 'Dr. Helen Clark'
        WHEN 2 THEN 'Dr. Mark Taylor'
        WHEN 3 THEN 'Dr. Jennifer Walsh'
        ELSE 'Dr. Susan Miller'
    END,
    CASE p.rn % 4
        WHEN 0 THEN 'Radiology Department'
        WHEN 1 THEN 'Ultrasound Department'
        WHEN 2 THEN 'Cardiology Department'
        ELSE 'CT Department'
    END,
    'completed'::test_status,
    CASE p.rn % 4
        WHEN 0 THEN jsonb_build_array(
            jsonb_build_object('parameter', 'Heart', 'value', 'Normal size and contour', 'unit', '', 'referenceRange', 'Normal', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Lungs', 'value', 'Clear lung fields bilaterally', 'unit', '', 'referenceRange', 'Clear', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Bones', 'value', 'No acute fractures', 'unit', '', 'referenceRange', 'Normal', 'flag', 'normal')
        )
        WHEN 1 THEN jsonb_build_array(
            jsonb_build_object('parameter', 'Liver', 'value', 'Normal echogenicity and size', 'unit', '', 'referenceRange', 'Normal', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Gallbladder', 'value', 'Multiple gallstones present', 'unit', '', 'referenceRange', 'Normal', 'flag', 'high'),
            jsonb_build_object('parameter', 'Kidneys', 'value', 'Both kidneys normal size', 'unit', '', 'referenceRange', 'Normal', 'flag', 'normal')
        )
        WHEN 2 THEN jsonb_build_array(
            jsonb_build_object('parameter', 'Rhythm', 'value', 'Sinus rhythm', 'unit', '', 'referenceRange', 'Regular', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Rate', 'value', '72', 'unit', 'bpm', 'referenceRange', '60-100', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Axis', 'value', 'Normal', 'unit', '', 'referenceRange', 'Normal', 'flag', 'normal'),
            jsonb_build_object('parameter', 'ST Changes', 'value', 'None', 'unit', '', 'referenceRange', 'None', 'flag', 'normal')
        )
        ELSE jsonb_build_array(
            jsonb_build_object('parameter', 'Brain', 'value', 'No acute intracranial abnormality', 'unit', '', 'referenceRange', 'Normal', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Ventricles', 'value', 'Normal size and position', 'unit', '', 'referenceRange', 'Normal', 'flag', 'normal'),
            jsonb_build_object('parameter', 'Blood', 'value', 'No evidence of haemorrhage', 'unit', '', 'referenceRange', 'None', 'flag', 'normal')
        )
    END,
    CASE p.rn % 4
        WHEN 0 THEN 'Normal chest X-ray. No acute cardiopulmonary abnormality.'
        WHEN 1 THEN 'Abdominal ultrasound shows cholelithiasis. Consider surgical consultation if symptomatic.'
        WHEN 2 THEN 'Normal 12-lead ECG. No evidence of ischaemia or arrhythmia.'
        ELSE 'CT head shows no acute pathology. No evidence of stroke or haemorrhage.'
    END,
    CASE p.rn % 4
        WHEN 0 THEN 'Pre-operative assessment.'
        WHEN 1 THEN 'Investigation of right upper quadrant pain.'
        WHEN 2 THEN 'Investigation of chest pain.'
        ELSE 'Investigation of acute confusion and headache.'
    END
FROM patient_list p
WHERE p.rn BETWEEN 1 AND 12

UNION ALL

-- Pending/In-progress tests
SELECT 
    p.id,
    CASE p.rn % 3
        WHEN 0 THEN 'Thyroid Function Tests'
        WHEN 1 THEN 'HbA1c'
        ELSE 'Lipid Profile'
    END,
    'blood',
    (CURRENT_DATE - INTERVAL '3 days' + (p.rn * INTERVAL '1 day'))::timestamp with time zone,
    (CURRENT_DATE - INTERVAL '2 days' + (p.rn * INTERVAL '1 day'))::timestamp with time zone,
    NULL,
    CASE p.rn % 3
        WHEN 0 THEN 'Dr. Andrew Davis'
        WHEN 1 THEN 'Dr. Catherine Brown'
        ELSE 'Dr. Stephen White'
    END,
    NULL,
    CASE p.rn % 3
        WHEN 0 THEN 'in-progress'::test_status
        WHEN 1 THEN 'in-progress'::test_status
        ELSE 'requested'::test_status
    END,
    NULL,
    NULL,
    CASE p.rn % 3
        WHEN 0 THEN 'Investigating symptoms of fatigue and weight changes.'
        WHEN 1 THEN 'Routine diabetic monitoring.'
        ELSE 'Cardiovascular risk assessment requested.'
    END
FROM patient_list p
WHERE p.rn BETWEEN 8 AND 15;