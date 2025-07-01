
import { supabase } from '@/integrations/supabase/client';

export const fetchPatientFromDatabase = async (patientId: string) => {
  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .select('*')
    .eq('id', patientId)
    .single();

  if (patientError || !patient) {
    throw new Error(`Error fetching patient: ${patientError?.message || 'Patient not found'}`);
  }

  return patient;
};

export const fetchRelatedPatientData = async (patientId: string) => {
  // Fetch GP details
  const { data: gpDetails } = await supabase
    .from('gp_details')
    .select('*')
    .eq('patient_id', patientId)
    .single();

  // Fetch related people
  const { data: relatedPeople } = await supabase
    .from('related_people')
    .select('*')
    .eq('patient_id', patientId);

  // Fetch historic addresses
  const { data: historicAddresses } = await supabase
    .from('historic_addresses')
    .select('*')
    .eq('patient_id', patientId)
    .order('date_from', { ascending: false });

  // Fetch pharmacy details
  const { data: pharmacies } = await supabase
    .from('pharmacy_details')
    .select('*')
    .eq('patient_id', patientId);

  // Fetch allergies
  const { data: allergies } = await supabase
    .from('allergies')
    .select('*')
    .eq('patient_id', patientId);

  // Fetch reasonable adjustments
  const { data: reasonableAdjustments } = await supabase
    .from('reasonable_adjustments')
    .select(`
      *,
      adjustment_details:adjustment_details(*)
    `)
    .eq('patient_id', patientId)
    .single();

  return {
    gpDetails,
    relatedPeople,
    historicAddresses,
    pharmacies,
    allergies,
    reasonableAdjustments
  };
};
