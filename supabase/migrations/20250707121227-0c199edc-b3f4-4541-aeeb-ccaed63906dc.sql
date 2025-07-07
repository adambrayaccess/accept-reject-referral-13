-- Create diagnosis status enum
CREATE TYPE public.diagnosis_status AS ENUM ('active', 'resolved', 'suspected', 'ruled_out', 'chronic');

-- Create diagnosis severity enum  
CREATE TYPE public.diagnosis_severity AS ENUM ('mild', 'moderate', 'severe', 'critical');

-- Create diagnosis table
CREATE TABLE public.diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    icd10_code VARCHAR(10),
    icd10_description TEXT,
    clinical_description TEXT NOT NULL,
    status public.diagnosis_status NOT NULL DEFAULT 'active',
    severity public.diagnosis_severity,
    diagnosed_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    resolved_date TIMESTAMP WITH TIME ZONE,
    diagnosed_by TEXT NOT NULL,
    notes TEXT,
    referral_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    CONSTRAINT fk_diagnoses_patient 
        FOREIGN KEY (patient_id) 
        REFERENCES public.patients(id) 
        ON DELETE CASCADE,
        
    CONSTRAINT fk_diagnoses_referral 
        FOREIGN KEY (referral_id) 
        REFERENCES public.referrals(id) 
        ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Authenticated users can access diagnoses" 
ON public.diagnoses 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_diagnoses_patient_id ON public.diagnoses(patient_id);
CREATE INDEX idx_diagnoses_icd10_code ON public.diagnoses(icd10_code);
CREATE INDEX idx_diagnoses_status ON public.diagnoses(status);
CREATE INDEX idx_diagnoses_diagnosed_date ON public.diagnoses(diagnosed_date);

-- Create trigger for updated_at
CREATE TRIGGER update_diagnoses_updated_at
    BEFORE UPDATE ON public.diagnoses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert comprehensive test diagnosis data
INSERT INTO public.diagnoses (patient_id, icd10_code, icd10_description, clinical_description, status, severity, diagnosed_date, diagnosed_by, notes, referral_id) VALUES
-- Get existing patient IDs for realistic data
-- Cardiovascular diagnoses
((SELECT id FROM patients LIMIT 1 OFFSET 0), 'I25.10', 'Atherosclerotic heart disease of native coronary artery without angina pectoris', 'Coronary artery disease with 70% stenosis of LAD', 'active', 'moderate', '2024-11-15 10:30:00+00', 'Dr. Sarah Mitchell', 'Patient requires cardiac catheterization and stent placement', (SELECT id FROM referrals WHERE specialty = 'Cardiology' LIMIT 1)),

((SELECT id FROM patients LIMIT 1 OFFSET 1), 'I10', 'Essential (primary) hypertension', 'Stage 2 hypertension with target organ damage', 'active', 'moderate', '2024-10-22 14:15:00+00', 'Dr. James Wilson', 'BP consistently >160/100, started on ACE inhibitor', NULL),

-- Respiratory diagnoses  
((SELECT id FROM patients LIMIT 1 OFFSET 2), 'J44.1', 'Chronic obstructive pulmonary disease with acute exacerbation', 'COPD exacerbation requiring hospitalization', 'active', 'severe', '2024-12-01 09:45:00+00', 'Dr. Emily Chen', 'FEV1 <30% predicted, on home oxygen', (SELECT id FROM referrals WHERE specialty = 'Respiratory Medicine' LIMIT 1)),

((SELECT id FROM patients LIMIT 1 OFFSET 3), 'J45.9', 'Asthma, unspecified', 'Moderate persistent asthma', 'active', 'moderate', '2024-09-18 11:20:00+00', 'Dr. Michael Brown', 'Well controlled on ICS/LABA combination', NULL),

-- Endocrine diagnoses
((SELECT id FROM patients LIMIT 1 OFFSET 4), 'E11.9', 'Type 2 diabetes mellitus without complications', 'Type 2 diabetes, diet controlled', 'active', 'mild', '2024-08-30 16:00:00+00', 'Dr. Lisa Anderson', 'HbA1c 7.2%, good dietary compliance', NULL),

((SELECT id FROM patients LIMIT 1 OFFSET 5), 'E03.9', 'Hypothyroidism, unspecified', 'Primary hypothyroidism', 'active', 'mild', '2024-07-12 13:30:00+00', 'Dr. David Thompson', 'TSH elevated at 12.5, started on levothyroxine', NULL),

-- Neurological diagnoses
((SELECT id FROM patients LIMIT 1 OFFSET 6), 'G93.1', 'Anoxic brain damage, not elsewhere classified', 'Post-stroke cognitive impairment', 'active', 'moderate', '2024-06-25 08:15:00+00', 'Dr. Rachel Green', 'Improving with speech therapy and cognitive rehabilitation', (SELECT id FROM referrals WHERE specialty = 'Neurology' LIMIT 1)),

((SELECT id FROM patients LIMIT 1 OFFSET 7), 'G40.909', 'Epilepsy, unspecified, not intractable, without status epilepticus', 'Focal epilepsy', 'active', 'moderate', '2024-05-14 12:45:00+00', 'Dr. Thomas Lee', 'Well controlled on carbamazepine', NULL),

-- Mental health diagnoses
((SELECT id FROM patients LIMIT 1 OFFSET 8), 'F32.1', 'Major depressive disorder, single episode, moderate', 'Major depressive episode', 'active', 'moderate', '2024-04-08 15:20:00+00', 'Dr. Jennifer Martinez', 'Responding well to sertraline and CBT', (SELECT id FROM referrals WHERE specialty = 'Psychiatry' LIMIT 1)),

((SELECT id FROM patients LIMIT 1 OFFSET 9), 'F41.1', 'Generalized anxiety disorder', 'Generalized anxiety disorder with panic attacks', 'active', 'mild', '2024-03-22 10:10:00+00', 'Dr. Kevin White', 'Managed with mindfulness techniques and PRN lorazepam', NULL),

-- Musculoskeletal diagnoses
((SELECT id FROM patients LIMIT 1 OFFSET 10), 'M79.3', 'Panniculitis, unspecified', 'Chronic lower back pain', 'active', 'moderate', '2024-02-17 14:30:00+00', 'Dr. Amanda Johnson', 'L4-L5 disc herniation with nerve impingement', (SELECT id FROM referrals WHERE specialty = 'Rheumatology' LIMIT 1)),

((SELECT id FROM patients LIMIT 1 OFFSET 11), 'M06.9', 'Rheumatoid arthritis, unspecified', 'Seropositive rheumatoid arthritis', 'active', 'moderate', '2024-01-29 11:40:00+00', 'Dr. Peter Davis', 'Stable on methotrexate and biologics', NULL),

-- Dermatological diagnoses
((SELECT id FROM patients LIMIT 1 OFFSET 12), 'L40.9', 'Psoriasis, unspecified', 'Moderate plaque psoriasis', 'active', 'moderate', '2024-12-10 09:00:00+00', 'Dr. Susan Clark', 'Covering 15% body surface area, started on topical therapy', (SELECT id FROM referrals WHERE specialty = 'Dermatology' LIMIT 1)),

((SELECT id FROM patients LIMIT 1 OFFSET 13), 'L20.9', 'Atopic dermatitis, unspecified', 'Severe atopic eczema', 'active', 'severe', '2024-11-28 16:45:00+00', 'Dr. Mark Rodriguez', 'Flare-up requiring systemic steroids', NULL),

-- Gastrointestinal diagnoses
((SELECT id FROM patients LIMIT 1 OFFSET 14), 'K50.90', 'Crohns disease, unspecified, without complications', 'Crohns disease of terminal ileum', 'active', 'moderate', '2024-10-05 13:15:00+00', 'Dr. Helen Taylor', 'Stable on immunosuppressive therapy', (SELECT id FROM referrals WHERE specialty = 'Gastroenterology' LIMIT 1)),

((SELECT id FROM patients LIMIT 1 OFFSET 15), 'K21.9', 'Gastro-esophageal reflux disease without esophagitis', 'GERD with nocturnal symptoms', 'active', 'mild', '2024-09-12 10:50:00+00', 'Dr. Robert Wilson', 'Controlled with PPI therapy and lifestyle changes', NULL),

-- Oncological diagnoses
((SELECT id FROM patients LIMIT 1 OFFSET 0), 'C78.00', 'Secondary malignant neoplasm of unspecified lung', 'Breast cancer in remission', 'resolved', 'severe', '2023-03-15 14:20:00+00', 'Dr. Maria Garcia', 'Complete response after chemotherapy and radiation', NULL),

-- Resolved diagnoses
((SELECT id FROM patients LIMIT 1 OFFSET 1), 'J06.9', 'Acute upper respiratory infection, unspecified', 'Upper respiratory tract infection', 'resolved', 'mild', '2024-11-01 12:00:00+00', 'Dr. John Smith', 'Resolved with supportive care', NULL),

((SELECT id FROM patients LIMIT 1 OFFSET 2), 'A09', 'Infectious gastroenteritis and colitis, unspecified', 'Viral gastroenteritis', 'resolved', 'mild', '2024-10-15 09:30:00+00', 'Dr. Sarah Johnson', 'Self-limiting illness, resolved in 5 days', NULL),

-- Suspected diagnoses
((SELECT id FROM patients LIMIT 1 OFFSET 3), 'R06.02', 'Shortness of breath', 'Query pulmonary embolism', 'suspected', 'moderate', '2024-12-15 11:15:00+00', 'Dr. Andrew Miller', 'Awaiting CTPA results', NULL);

-- Add some additional random diagnoses for variety
INSERT INTO public.diagnoses (patient_id, icd10_code, icd10_description, clinical_description, status, severity, diagnosed_date, diagnosed_by, notes) 
SELECT 
    p.id as patient_id,
    CASE (RANDOM() * 10)::INTEGER
        WHEN 0 THEN 'I25.10'
        WHEN 1 THEN 'E11.9' 
        WHEN 2 THEN 'J44.1'
        WHEN 3 THEN 'F32.1'
        WHEN 4 THEN 'M06.9'
        WHEN 5 THEN 'L40.9'
        WHEN 6 THEN 'K50.90'
        WHEN 7 THEN 'I10'
        WHEN 8 THEN 'J45.9'
        WHEN 9 THEN 'E03.9'
    END as icd10_code,
    CASE (RANDOM() * 10)::INTEGER
        WHEN 0 THEN 'Atherosclerotic heart disease'
        WHEN 1 THEN 'Type 2 diabetes mellitus'
        WHEN 2 THEN 'Chronic obstructive pulmonary disease'
        WHEN 3 THEN 'Major depressive disorder'
        WHEN 4 THEN 'Rheumatoid arthritis'
        WHEN 5 THEN 'Psoriasis'
        WHEN 6 THEN 'Crohns disease'
        WHEN 7 THEN 'Essential hypertension'
        WHEN 8 THEN 'Asthma'
        WHEN 9 THEN 'Hypothyroidism'
    END as icd10_description,
    CASE (RANDOM() * 10)::INTEGER
        WHEN 0 THEN 'Coronary artery disease requiring monitoring'
        WHEN 1 THEN 'Well-controlled diabetes'
        WHEN 2 THEN 'COPD with periodic exacerbations'
        WHEN 3 THEN 'Depression responding to treatment'
        WHEN 4 THEN 'Inflammatory arthritis'
        WHEN 5 THEN 'Chronic skin condition'
        WHEN 6 THEN 'Inflammatory bowel disease'
        WHEN 7 THEN 'High blood pressure'
        WHEN 8 THEN 'Allergic asthma'
        WHEN 9 THEN 'Underactive thyroid'
    END as clinical_description,
    CASE (RANDOM() * 4)::INTEGER
        WHEN 0 THEN 'active'::public.diagnosis_status
        WHEN 1 THEN 'chronic'::public.diagnosis_status
        WHEN 2 THEN 'resolved'::public.diagnosis_status
        WHEN 3 THEN 'suspected'::public.diagnosis_status
    END as status,
    CASE (RANDOM() * 4)::INTEGER
        WHEN 0 THEN 'mild'::public.diagnosis_severity
        WHEN 1 THEN 'moderate'::public.diagnosis_severity
        WHEN 2 THEN 'severe'::public.diagnosis_severity
        WHEN 3 THEN 'critical'::public.diagnosis_severity
    END as severity,
    NOW() - (RANDOM() * INTERVAL '2 years') as diagnosed_date,
    CASE (RANDOM() * 5)::INTEGER
        WHEN 0 THEN 'Dr. Sarah Mitchell'
        WHEN 1 THEN 'Dr. James Wilson'
        WHEN 2 THEN 'Dr. Emily Chen'
        WHEN 3 THEN 'Dr. Michael Brown'
        WHEN 4 THEN 'Dr. Lisa Anderson'
    END as diagnosed_by,
    'Additional diagnosis for comprehensive patient care' as notes
FROM patients p
WHERE NOT EXISTS (
    SELECT 1 FROM diagnoses d WHERE d.patient_id = p.id
)
LIMIT 20;