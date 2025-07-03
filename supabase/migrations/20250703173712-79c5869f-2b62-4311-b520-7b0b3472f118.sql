-- Create pinned_referrals table to track user pinned referrals
CREATE TABLE public.pinned_referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  referral_id UUID NOT NULL REFERENCES public.referrals(id) ON DELETE CASCADE,
  pinned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, referral_id)
);

-- Enable Row Level Security
ALTER TABLE public.pinned_referrals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pinned_referrals
CREATE POLICY "Users can view their own pinned referrals" 
ON public.pinned_referrals 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can pin referrals" 
ON public.pinned_referrals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unpin their own referrals" 
ON public.pinned_referrals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_pinned_referrals_user_id ON public.pinned_referrals(user_id);
CREATE INDEX idx_pinned_referrals_referral_id ON public.pinned_referrals(referral_id);