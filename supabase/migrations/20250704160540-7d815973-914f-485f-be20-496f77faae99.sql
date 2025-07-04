-- Enable pg_net extension for HTTP requests from database functions
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Set the service role key as a database setting (you'll need to replace this with your actual key)
-- This allows the trigger function to authenticate with the edge function
ALTER DATABASE postgres SET "app.supabase_service_role_key" TO 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzeWhlaGNtc3Z3ZWRtdG5zb2F0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDg0ODUzMSwiZXhwIjoyMDY2NDI0NTMxfQ.pJMfXfbN0g6FfX4TFBs9v8-LxOD6jKP8KTsRIbfJihs';