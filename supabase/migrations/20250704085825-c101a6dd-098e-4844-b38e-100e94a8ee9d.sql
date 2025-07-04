-- Enable realtime for referrals table
ALTER TABLE public.referrals REPLICA IDENTITY FULL;

-- Add the table to the realtime publication 
ALTER PUBLICATION supabase_realtime ADD TABLE public.referrals;