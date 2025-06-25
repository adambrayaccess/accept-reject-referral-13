
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rsyhehcmsvwedmtnsoat.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzeWhlaGNtc3Z3ZWRtdG5zb2F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDg1MzEsImV4cCI6MjA2NjQyNDUzMX0.s0Sn2IHtUNX5BpTianYJGBVpU9-nqPGLkZbCRjVCJAI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
