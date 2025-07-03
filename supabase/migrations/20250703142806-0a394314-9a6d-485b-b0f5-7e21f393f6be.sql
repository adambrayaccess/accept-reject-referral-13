-- Create proper foreign key relationship between adjustment_details and reasonable_adjustments
-- The adjustment_details table already has reasonable_adjustments_id column, but let's ensure the foreign key constraint is properly set

-- First, let's make sure the foreign key constraint exists
-- If it already exists, this will be ignored; if not, it will be added
DO $$
BEGIN
    -- Check if the foreign key constraint already exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'adjustment_details_reasonable_adjustments_id_fkey'
        AND table_name = 'adjustment_details'
    ) THEN
        -- Add the foreign key constraint
        ALTER TABLE public.adjustment_details 
        ADD CONSTRAINT adjustment_details_reasonable_adjustments_id_fkey 
        FOREIGN KEY (reasonable_adjustments_id) 
        REFERENCES public.reasonable_adjustments(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- Create index on the foreign key for better performance if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_adjustment_details_reasonable_adjustments_id 
ON public.adjustment_details(reasonable_adjustments_id);

-- Add comments to document the relationship
COMMENT ON COLUMN public.adjustment_details.reasonable_adjustments_id IS 'Foreign key reference to the reasonable_adjustments table';
COMMENT ON TABLE public.adjustment_details IS 'Details of specific reasonable adjustments for patients';
COMMENT ON TABLE public.reasonable_adjustments IS 'Parent table for patient reasonable adjustments with details in adjustment_details';