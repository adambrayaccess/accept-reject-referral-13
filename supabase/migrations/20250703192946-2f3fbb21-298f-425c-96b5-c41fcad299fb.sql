-- Create table for clinical notes
CREATE TABLE public.clinical_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_id UUID NOT NULL REFERENCES referrals(id) ON DELETE CASCADE,
  note_content TEXT NOT NULL,
  note_type TEXT NOT NULL DEFAULT 'clinical',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.clinical_notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can access clinical_notes" 
ON public.clinical_notes 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_clinical_notes_updated_at
BEFORE UPDATE ON public.clinical_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_clinical_notes_referral_id ON public.clinical_notes(referral_id);
CREATE INDEX idx_clinical_notes_created_at ON public.clinical_notes(created_at);