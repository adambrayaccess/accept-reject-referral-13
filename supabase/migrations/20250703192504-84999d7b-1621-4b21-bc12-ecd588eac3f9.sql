-- Create table for referral letters
CREATE TABLE public.referral_letters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_id UUID NOT NULL REFERENCES referrals(id) ON DELETE CASCADE,
  letter_type TEXT NOT NULL,
  letter_content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE,
  created_by TEXT,
  recipient_name TEXT,
  recipient_email TEXT
);

-- Enable Row Level Security
ALTER TABLE public.referral_letters ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can access referral_letters" 
ON public.referral_letters 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_referral_letters_updated_at
BEFORE UPDATE ON public.referral_letters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_referral_letters_referral_id ON public.referral_letters(referral_id);
CREATE INDEX idx_referral_letters_status ON public.referral_letters(status);