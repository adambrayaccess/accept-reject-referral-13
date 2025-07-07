-- Create RTT Pathways table
CREATE TABLE public.rtt_pathways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID NOT NULL REFERENCES public.referrals(id) ON DELETE CASCADE,
  clock_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  target_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  breach_risk TEXT NOT NULL DEFAULT 'low',
  days_remaining INTEGER NOT NULL DEFAULT 126,
  pause_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT rtt_pathways_status_check CHECK (status IN ('active', 'paused', 'completed', 'discontinued')),
  CONSTRAINT rtt_pathways_breach_risk_check CHECK (breach_risk IN ('low', 'medium', 'high', 'breached')),
  CONSTRAINT unique_referral_rtt_pathway UNIQUE (referral_id)
);

-- Create Care Pathways table
CREATE TABLE public.care_pathways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID NOT NULL REFERENCES public.referrals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  description TEXT,
  target_timeframe TEXT,
  priority_level TEXT DEFAULT 'standard',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT care_pathways_status_check CHECK (status IN ('active', 'completed', 'cancelled', 'on-hold')),
  CONSTRAINT care_pathways_priority_check CHECK (priority_level IN ('low', 'standard', 'high', 'urgent')),
  CONSTRAINT unique_referral_care_pathway UNIQUE (referral_id)
);

-- Enable Row Level Security
ALTER TABLE public.rtt_pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_pathways ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for RTT pathways
CREATE POLICY "Authenticated users can access rtt_pathways"
ON public.rtt_pathways
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create RLS policies for Care pathways
CREATE POLICY "Authenticated users can access care_pathways"
ON public.care_pathways
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_rtt_pathways_referral_id ON public.rtt_pathways(referral_id);
CREATE INDEX idx_rtt_pathways_status ON public.rtt_pathways(status);
CREATE INDEX idx_rtt_pathways_breach_risk ON public.rtt_pathways(breach_risk);

CREATE INDEX idx_care_pathways_referral_id ON public.care_pathways(referral_id);
CREATE INDEX idx_care_pathways_status ON public.care_pathways(status);
CREATE INDEX idx_care_pathways_priority ON public.care_pathways(priority_level);

-- Create function to update RTT pathway automatically
CREATE OR REPLACE FUNCTION public.update_rtt_pathway_status()
RETURNS TRIGGER AS $$
DECLARE
  target_date TIMESTAMP WITH TIME ZONE;
  days_remaining INTEGER;
  new_breach_risk TEXT;
BEGIN
  -- Calculate days remaining
  target_date := NEW.clock_start_date + INTERVAL '126 days';
  days_remaining := EXTRACT(days FROM target_date - NOW());
  
  -- Determine breach risk
  IF days_remaining < 0 THEN
    new_breach_risk := 'breached';
  ELSIF days_remaining <= 14 THEN
    new_breach_risk := 'high';
  ELSIF days_remaining <= 28 THEN
    new_breach_risk := 'medium';
  ELSE
    new_breach_risk := 'low';
  END IF;
  
  -- Update calculated values
  NEW.target_date := target_date;
  NEW.days_remaining := GREATEST(0, days_remaining);
  NEW.breach_risk := new_breach_risk;
  NEW.updated_at := now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for RTT pathway updates
CREATE TRIGGER trigger_update_rtt_pathway
  BEFORE INSERT OR UPDATE ON public.rtt_pathways
  FOR EACH ROW
  EXECUTE FUNCTION public.update_rtt_pathway_status();

-- Create trigger for updated_at columns
CREATE TRIGGER trigger_rtt_pathways_updated_at
  BEFORE UPDATE ON public.rtt_pathways
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_care_pathways_updated_at
  BEFORE UPDATE ON public.care_pathways
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to initialize RTT pathway for existing referrals
CREATE OR REPLACE FUNCTION public.initialize_rtt_pathway(referral_id_param UUID)
RETURNS UUID AS $$
DECLARE
  referral_record RECORD;
  rtt_pathway_id UUID;
BEGIN
  -- Get referral data
  SELECT * INTO referral_record FROM public.referrals WHERE id = referral_id_param;
  
  IF referral_record IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Check if RTT pathway already exists
  IF EXISTS (SELECT 1 FROM public.rtt_pathways WHERE referral_id = referral_id_param) THEN
    SELECT id INTO rtt_pathway_id FROM public.rtt_pathways WHERE referral_id = referral_id_param;
    RETURN rtt_pathway_id;
  END IF;
  
  -- Create RTT pathway
  INSERT INTO public.rtt_pathways (
    referral_id,
    clock_start_date,
    status
  ) VALUES (
    referral_id_param,
    COALESCE(referral_record.created_at, now()),
    CASE 
      WHEN referral_record.status = 'discharged' THEN 'completed'
      WHEN referral_record.status = 'cancelled' THEN 'discontinued'
      ELSE 'active'
    END
  ) RETURNING id INTO rtt_pathway_id;
  
  RETURN rtt_pathway_id;
END;
$$ LANGUAGE plpgsql;