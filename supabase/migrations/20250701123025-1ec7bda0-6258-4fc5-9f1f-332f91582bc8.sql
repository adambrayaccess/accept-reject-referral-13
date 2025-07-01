
-- Add access restriction fields to patients table
ALTER TABLE patients 
ADD COLUMN access_restriction_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN access_restriction_level TEXT CHECK (access_restriction_level IN ('standard', 'high', 'maximum')),
ADD COLUMN access_restriction_reason TEXT,
ADD COLUMN access_restriction_applied_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN access_restriction_applied_by TEXT,
ADD COLUMN access_restriction_review_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN access_restriction_notes TEXT;

-- Create related_people table for next of kin and contacts
CREATE TABLE related_people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  is_primary_contact BOOLEAN DEFAULT FALSE,
  is_next_of_kin BOOLEAN DEFAULT FALSE,
  is_emergency_contact BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create historic_addresses table
CREATE TABLE historic_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  date_from TIMESTAMP WITH TIME ZONE NOT NULL,
  date_to TIMESTAMP WITH TIME ZONE,
  address_type TEXT CHECK (address_type IN ('residential', 'temporary', 'correspondence')) DEFAULT 'residential',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pharmacy_details table
CREATE TABLE pharmacy_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  pharmacy_type TEXT CHECK (pharmacy_type IN ('nominated', 'linked')) DEFAULT 'nominated',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for new tables
ALTER TABLE related_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE historic_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_details ENABLE ROW LEVEL SECURITY;

-- Policies for related_people
CREATE POLICY "Authenticated users can access related_people" 
  ON related_people FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Policies for historic_addresses
CREATE POLICY "Authenticated users can access historic_addresses" 
  ON historic_addresses FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Policies for pharmacy_details
CREATE POLICY "Authenticated users can access pharmacy_details" 
  ON pharmacy_details FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Add triggers for updated_at
CREATE TRIGGER update_related_people_updated_at
  BEFORE UPDATE ON related_people
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data to test the new features
INSERT INTO related_people (patient_id, name, relationship, phone, email, is_next_of_kin, is_emergency_contact)
SELECT 
  p.id,
  'Sarah Johnson',
  'sister',
  '+44 7700 900123',
  'sarah.johnson@email.com',
  true,
  true
FROM patients p 
WHERE p.name = 'Emma Wilson'
LIMIT 1;

INSERT INTO pharmacy_details (patient_id, name, address, phone, pharmacy_type)
SELECT 
  p.id,
  'Boots Pharmacy',
  '123 High Street, London, SW1A 1AA',
  '+44 20 7946 0958',
  'nominated'
FROM patients p
WHERE p.name = 'Emma Wilson'
LIMIT 1;
