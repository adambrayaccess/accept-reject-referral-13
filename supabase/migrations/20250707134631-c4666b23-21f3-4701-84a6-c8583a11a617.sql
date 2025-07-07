-- Fix the incorrect clock start date for this specific referral
UPDATE public.rtt_pathways 
SET clock_start_date = '2025-07-07T07:58:15.030412+00:00'
WHERE referral_id = 'e6dd3d14-3195-4d10-8a0f-9046d3a78c96';

-- This will trigger the automatic update function to recalculate target_date, days_remaining, and breach_risk