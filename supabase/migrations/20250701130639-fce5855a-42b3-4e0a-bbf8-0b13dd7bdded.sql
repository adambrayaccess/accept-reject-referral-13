
-- Create FHIR resource tables and extensions

-- Create enum types for FHIR-specific values
CREATE TYPE fhir_resource_type AS ENUM (
  'Patient', 'Practitioner', 'Organization', 'ServiceRequest', 
  'Observation', 'Condition', 'MedicationStatement', 'AllergyIntolerance',
  'Appointment', 'DocumentReference', 'DiagnosticReport'
);

CREATE TYPE fhir_status AS ENUM (
  'active', 'inactive', 'suspended', 'unknown', 'entered-in-error'
);

CREATE TYPE administrative_gender AS ENUM (
  'male', 'female', 'other', 'unknown'
);

CREATE TYPE address_use AS ENUM (
  'home', 'work', 'temp', 'old', 'billing'
);

CREATE TYPE contact_point_system AS ENUM (
  'phone', 'fax', 'email', 'pager', 'url', 'sms', 'other'
);

CREATE TYPE contact_point_use AS ENUM (
  'home', 'work', 'temp', 'old', 'mobile'
);

-- Create FHIR resources table for tracking all FHIR resources
CREATE TABLE fhir_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fhir_id TEXT NOT NULL UNIQUE,
  resource_type fhir_resource_type NOT NULL,
  version_id TEXT DEFAULT '1',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resource_data JSONB NOT NULL,
  legacy_table_id UUID,
  legacy_table_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add FHIR compliance fields to existing tables

-- Add FHIR fields to patients table
ALTER TABLE patients ADD COLUMN fhir_id TEXT UNIQUE;
ALTER TABLE patients ADD COLUMN active BOOLEAN DEFAULT TRUE;
ALTER TABLE patients ADD COLUMN deceased_boolean BOOLEAN DEFAULT FALSE;
ALTER TABLE patients ADD COLUMN deceased_datetime TIMESTAMP WITH TIME ZONE;
ALTER TABLE patients ADD COLUMN marital_status_code TEXT;
ALTER TABLE patients ADD COLUMN marital_status_display TEXT;
ALTER TABLE patients ADD COLUMN multiple_birth_boolean BOOLEAN DEFAULT FALSE;
ALTER TABLE patients ADD COLUMN multiple_birth_integer INTEGER;
ALTER TABLE patients ADD COLUMN communication_language_code TEXT DEFAULT 'en';
ALTER TABLE patients ADD COLUMN general_practitioner_reference TEXT;
ALTER TABLE patients ADD COLUMN managing_organization_reference TEXT;

-- Add FHIR fields to practitioners table
ALTER TABLE practitioners ADD COLUMN fhir_id TEXT UNIQUE;
ALTER TABLE practitioners ADD COLUMN active BOOLEAN DEFAULT TRUE;
ALTER TABLE practitioners ADD COLUMN gender administrative_gender;
ALTER TABLE practitioners ADD COLUMN birth_date DATE;
ALTER TABLE practitioners ADD COLUMN qualification_code TEXT;
ALTER TABLE practitioners ADD COLUMN qualification_display TEXT;
ALTER TABLE practitioners ADD COLUMN qualification_issuer TEXT;

-- Add FHIR fields to referrals table (ServiceRequest)
ALTER TABLE referrals ADD COLUMN fhir_id TEXT UNIQUE;
ALTER TABLE referrals ADD COLUMN intent TEXT DEFAULT 'order';
ALTER TABLE referrals ADD COLUMN category_code TEXT;
ALTER TABLE referrals ADD COLUMN category_display TEXT;
ALTER TABLE referrals ADD COLUMN code_code TEXT;
ALTER TABLE referrals ADD COLUMN code_display TEXT;
ALTER TABLE referrals ADD COLUMN occurrence_datetime TIMESTAMP WITH TIME ZONE;
ALTER TABLE referrals ADD COLUMN occurrence_period_start TIMESTAMP WITH TIME ZONE;
ALTER TABLE referrals ADD COLUMN occurrence_period_end TIMESTAMP WITH TIME ZONE;
ALTER TABLE referrals ADD COLUMN authored_on TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE referrals ADD COLUMN requester_reference TEXT;
ALTER TABLE referrals ADD COLUMN performer_reference TEXT;
ALTER TABLE referrals ADD COLUMN reasonable_code_code TEXT;
ALTER TABLE referrals ADD COLUMN reasonable_code_display TEXT;
ALTER TABLE referrals ADD COLUMN supporting_info TEXT[];

-- Create FHIR identifier table for managing identifiers across resources
CREATE TABLE fhir_identifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL,
  resource_type fhir_resource_type NOT NULL,
  use TEXT CHECK (use IN ('usual', 'official', 'temp', 'secondary', 'old')),
  type_code TEXT,
  type_display TEXT,
  system TEXT,
  value TEXT NOT NULL,
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  assigner_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create FHIR address table for structured addresses
CREATE TABLE fhir_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL,
  resource_type fhir_resource_type NOT NULL,
  use address_use,
  type TEXT CHECK (type IN ('postal', 'physical', 'both')),
  text TEXT,
  line TEXT[],
  city TEXT,
  district TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create FHIR contact points table (phone, email, etc.)
CREATE TABLE fhir_contact_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL,
  resource_type fhir_resource_type NOT NULL,
  system contact_point_system NOT NULL,
  value TEXT NOT NULL,
  use contact_point_use,
  rank INTEGER,
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create FHIR human names table
CREATE TABLE fhir_human_names (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL,
  resource_type fhir_resource_type NOT NULL,
  use TEXT CHECK (use IN ('usual', 'official', 'temp', 'nickname', 'anonymous', 'old', 'maiden')),
  text TEXT,
  family TEXT,
  given TEXT[],
  prefix TEXT[],
  suffix TEXT[],
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create FHIR coding table for coded values
CREATE TABLE fhir_codings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL,
  resource_type fhir_resource_type NOT NULL,
  field_name TEXT NOT NULL,
  system TEXT,
  version TEXT,
  code TEXT,
  display TEXT,
  user_selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_fhir_resources_type ON fhir_resources(resource_type);
CREATE INDEX idx_fhir_resources_fhir_id ON fhir_resources(fhir_id);
CREATE INDEX idx_fhir_identifiers_resource ON fhir_identifiers(resource_id, resource_type);
CREATE INDEX idx_fhir_identifiers_value ON fhir_identifiers(value);
CREATE INDEX idx_fhir_addresses_resource ON fhir_addresses(resource_id, resource_type);
CREATE INDEX idx_fhir_contact_points_resource ON fhir_contact_points(resource_id, resource_type);
CREATE INDEX idx_fhir_human_names_resource ON fhir_human_names(resource_id, resource_type);
CREATE INDEX idx_fhir_codings_resource ON fhir_codings(resource_id, resource_type);

-- Add RLS policies for new tables
ALTER TABLE fhir_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE fhir_identifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE fhir_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE fhir_contact_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE fhir_human_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE fhir_codings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can access fhir_resources" 
  ON fhir_resources FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can access fhir_identifiers" 
  ON fhir_identifiers FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can access fhir_addresses" 
  ON fhir_addresses FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can access fhir_contact_points" 
  ON fhir_contact_points FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can access fhir_human_names" 
  ON fhir_human_names FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can access fhir_codings" 
  ON fhir_codings FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_fhir_resources_updated_at
  BEFORE UPDATE ON fhir_resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate FHIR IDs for existing records
UPDATE patients SET fhir_id = 'Patient/' || id::text WHERE fhir_id IS NULL;
UPDATE practitioners SET fhir_id = 'Practitioner/' || id::text WHERE fhir_id IS NULL;
UPDATE referrals SET fhir_id = 'ServiceRequest/' || id::text WHERE fhir_id IS NULL;

-- Create function to generate FHIR resource JSON
CREATE OR REPLACE FUNCTION generate_fhir_patient_resource(patient_row patients)
RETURNS JSONB AS $$
DECLARE
  resource JSONB;
BEGIN
  resource := jsonb_build_object(
    'resourceType', 'Patient',
    'id', patient_row.id::text,
    'meta', jsonb_build_object(
      'versionId', '1',
      'lastUpdated', patient_row.updated_at
    ),
    'active', COALESCE(patient_row.active, true),
    'name', jsonb_build_array(
      jsonb_build_object(
        'use', 'official',
        'text', patient_row.name
      )
    ),
    'gender', CASE 
      WHEN patient_row.gender = 'male' THEN 'male'
      WHEN patient_row.gender = 'female' THEN 'female'
      ELSE 'unknown'
    END,
    'birthDate', patient_row.birth_date
  );
  
  -- Add identifier if NHS number exists
  IF patient_row.nhs_number IS NOT NULL THEN
    resource := jsonb_set(resource, '{identifier}', 
      jsonb_build_array(
        jsonb_build_object(
          'use', 'official',
          'system', 'https://fhir.nhs.uk/Id/nhs-number',
          'value', patient_row.nhs_number
        )
      )
    );
  END IF;
  
  -- Add address if exists
  IF patient_row.address IS NOT NULL THEN
    resource := jsonb_set(resource, '{address}', 
      jsonb_build_array(
        jsonb_build_object(
          'use', 'home',
          'text', patient_row.address
        )
      )
    );
  END IF;
  
  -- Add phone if exists
  IF patient_row.phone IS NOT NULL THEN
    resource := jsonb_set(resource, '{telecom}', 
      jsonb_build_array(
        jsonb_build_object(
          'system', 'phone',
          'value', patient_row.phone,
          'use', 'home'
        )
      )
    );
  END IF;
  
  RETURN resource;
END;
$$ LANGUAGE plpgsql;
