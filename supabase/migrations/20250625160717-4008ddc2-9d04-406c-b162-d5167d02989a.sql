
-- Create enum types for referral system
CREATE TYPE referral_status AS ENUM ('new', 'accepted', 'rejected', 'completed', 'cancelled');
CREATE TYPE referral_priority AS ENUM ('routine', 'urgent', 'emergency');
CREATE TYPE triage_status AS ENUM ('pending', 'in-progress', 'completed', 'waiting-list');
CREATE TYPE allergy_type AS ENUM ('drug', 'food', 'environmental', 'contact', 'other');
CREATE TYPE allergy_severity AS ENUM ('mild', 'moderate', 'severe', 'life-threatening');
CREATE TYPE allergy_status AS ENUM ('active', 'inactive', 'resolved');
CREATE TYPE verification_status AS ENUM ('confirmed', 'unconfirmed', 'suspected');
CREATE TYPE medication_status AS ENUM ('active', 'discontinued', 'completed', 'paused');
CREATE TYPE test_status AS ENUM ('requested', 'collected', 'in-progress', 'completed', 'cancelled');
CREATE TYPE mha_status AS ENUM ('active', 'expired', 'discharged', 'appealed');
CREATE TYPE adjustment_category AS ENUM ('communication', 'mobility', 'sensory', 'cognitive', 'mental-health', 'physical', 'other');
CREATE TYPE adjustment_status AS ENUM ('active', 'inactive', 'under-review');
CREATE TYPE flag_level AS ENUM ('none', 'standard', 'complex', 'high-risk');
CREATE TYPE appointment_type AS ENUM ('consultation', 'pre-admission', 'follow-up', 'procedure', 'virtual');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'cancelled', 'completed', 'no-show');

-- Patients table
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nhs_number VARCHAR(12) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT,
  address TEXT,
  phone TEXT,
  pronouns TEXT,
  ethnicity TEXT,
  accommodation_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GP Details table
CREATE TABLE public.gp_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  practice TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Practitioners table
CREATE TABLE public.practitioners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  organization TEXT,
  contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referrals table
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ubrn TEXT UNIQUE NOT NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  referrer_id UUID REFERENCES public.practitioners(id) NOT NULL,
  specialty TEXT NOT NULL,
  service TEXT,
  status referral_status DEFAULT 'new',
  priority referral_priority DEFAULT 'routine',
  triage_status triage_status,
  reason TEXT NOT NULL,
  history TEXT,
  diagnosis TEXT,
  medications TEXT,
  allergies_info TEXT,
  notes TEXT,
  parent_referral_id UUID REFERENCES public.referrals(id),
  is_sub_referral BOOLEAN DEFAULT FALSE,
  ai_generated BOOLEAN DEFAULT FALSE,
  confidence NUMERIC(3,2),
  team_id TEXT,
  assigned_hcp_id TEXT,
  allocated_date TIMESTAMP WITH TIME ZONE,
  allocated_by TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allergies table
CREATE TABLE public.allergies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  allergen TEXT NOT NULL,
  type allergy_type NOT NULL,
  severity allergy_severity NOT NULL,
  status allergy_status DEFAULT 'active',
  reactions JSONB,
  onset_date TIMESTAMP WITH TIME ZONE,
  last_reaction_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  verification_status verification_status DEFAULT 'unconfirmed',
  recorded_by TEXT,
  recorded_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medications table
CREATE TABLE public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  indication TEXT,
  status medication_status DEFAULT 'active',
  prescribed_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  prescribed_by TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Results table
CREATE TABLE public.test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  test_name TEXT NOT NULL,
  test_type TEXT NOT NULL,
  requested_date TIMESTAMP WITH TIME ZONE NOT NULL,
  sample_date TIMESTAMP WITH TIME ZONE,
  report_date TIMESTAMP WITH TIME ZONE,
  requested_by TEXT NOT NULL,
  performed_by TEXT,
  status test_status DEFAULT 'requested',
  results JSONB,
  interpretation TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vital Signs table
CREATE TABLE public.vital_signs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  news2 INTEGER,
  temperature NUMERIC(4,1),
  heart_rate INTEGER,
  respiration INTEGER,
  oxygen_saturation INTEGER,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MHA Sections table
CREATE TABLE public.mha_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  section_number TEXT NOT NULL,
  section_title TEXT NOT NULL,
  applied_date TIMESTAMP WITH TIME ZONE NOT NULL,
  expiry_date TIMESTAMP WITH TIME ZONE,
  status mha_status NOT NULL,
  consultant_responsible TEXT NOT NULL,
  hospital TEXT NOT NULL,
  reason TEXT NOT NULL,
  review_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reasonable Adjustments table
CREATE TABLE public.reasonable_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  has_adjustments BOOLEAN DEFAULT FALSE,
  flag_level flag_level DEFAULT 'none',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adjustment Details table
CREATE TABLE public.adjustment_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reasonable_adjustments_id UUID REFERENCES public.reasonable_adjustments(id) ON DELETE CASCADE NOT NULL,
  category adjustment_category NOT NULL,
  description TEXT NOT NULL,
  specific_needs TEXT NOT NULL,
  implementation_notes TEXT,
  date_recorded TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recorded_by TEXT NOT NULL,
  review_date TIMESTAMP WITH TIME ZONE,
  status adjustment_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID REFERENCES public.referrals(id) ON DELETE CASCADE NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  type appointment_type NOT NULL,
  location TEXT NOT NULL,
  consultant TEXT NOT NULL,
  status appointment_status DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Log table
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID REFERENCES public.referrals(id) ON DELETE CASCADE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaboration Notes table
CREATE TABLE public.collaboration_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID REFERENCES public.referrals(id) ON DELETE CASCADE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attachments table
CREATE TABLE public.attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID REFERENCES public.referrals(id) ON DELETE CASCADE NOT NULL,
  filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  uploaded_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by TEXT NOT NULL,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags table for referrals
CREATE TABLE public.referral_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID REFERENCES public.referrals(id) ON DELETE CASCADE NOT NULL,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(referral_id, tag)
);

-- Create indexes for better performance
CREATE INDEX idx_patients_nhs_number ON public.patients(nhs_number);
CREATE INDEX idx_referrals_status ON public.referrals(status);
CREATE INDEX idx_referrals_priority ON public.referrals(priority);
CREATE INDEX idx_referrals_specialty ON public.referrals(specialty);
CREATE INDEX idx_referrals_patient_id ON public.referrals(patient_id);
CREATE INDEX idx_referrals_created_at ON public.referrals(created_at);
CREATE INDEX idx_allergies_patient_id ON public.allergies(patient_id);
CREATE INDEX idx_medications_patient_id ON public.medications(patient_id);
CREATE INDEX idx_test_results_patient_id ON public.test_results(patient_id);
CREATE INDEX idx_vital_signs_patient_id ON public.vital_signs(patient_id);
CREATE INDEX idx_mha_sections_patient_id ON public.mha_sections(patient_id);

-- Enable Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gp_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practitioners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mha_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reasonable_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adjustment_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (initially permissive for authenticated users)
CREATE POLICY "Authenticated users can access patients" ON public.patients
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can access gp_details" ON public.gp_details
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can access practitioners" ON public.practitioners
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can access referrals" ON public.referrals
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can access allergies" ON public.allergies
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can access medications" ON public.medications
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can access test_results" ON public.test_results
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can access vital_signs" ON public.vital_signs
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can access mha_sections" ON public.mha_sections
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can access reasonable_adjustments" ON public.reasonable_adjustments
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can access adjustment_details" ON public.adjustment_details
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can access appointments" ON public.appointments
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can access audit_log" ON public.audit_log
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can access collaboration_notes" ON public.collaboration_notes
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can access attachments" ON public.attachments
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can access referral_tags" ON public.referral_tags
  TO authenticated USING (true) WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON public.referrals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
