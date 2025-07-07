-- First, let's check what the current constraint allows
-- Then update it to include 'discharged' as a valid action

-- Drop the existing check constraint
ALTER TABLE public.waiting_list_history DROP CONSTRAINT IF EXISTS waiting_list_history_action_check;

-- Create a new check constraint that includes 'discharged'
ALTER TABLE public.waiting_list_history 
ADD CONSTRAINT waiting_list_history_action_check 
CHECK (action IN ('added', 'removed', 'reordered', 'priority_changed', 'discharged'));

-- Also check if there are any other action values currently in use that we should include
-- Let's make it more flexible to handle future actions
ALTER TABLE public.waiting_list_history DROP CONSTRAINT waiting_list_history_action_check;

-- Create a more flexible constraint that allows common waiting list actions
ALTER TABLE public.waiting_list_history 
ADD CONSTRAINT waiting_list_history_action_check 
CHECK (action IN ('added', 'removed', 'reordered', 'priority_changed', 'discharged', 'transferred', 'completed'));