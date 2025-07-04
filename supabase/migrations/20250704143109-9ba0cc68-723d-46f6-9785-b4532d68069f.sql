-- Create inpatient_admissions table to track ward admissions
CREATE TABLE public.inpatient_admissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  referral_id UUID,
  ward_name TEXT NOT NULL,
  bed_number TEXT,
  bay_number TEXT,
  admission_datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  admission_reason TEXT NOT NULL,
  current_status TEXT NOT NULL DEFAULT 'Active',
  discharge_datetime TIMESTAMP WITH TIME ZONE,
  consultant TEXT,
  specialty TEXT,
  notes TEXT,
  admitted_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inpatient_admissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Authenticated users can access inpatient_admissions" 
ON public.inpatient_admissions 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_inpatient_admissions_updated_at
BEFORE UPDATE ON public.inpatient_admissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();