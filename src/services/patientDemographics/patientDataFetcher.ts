
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

  // PHASE 2: Fetch comprehensive medical history data
  // Fetch vital signs
  const { data: vitalSigns } = await supabase
    .from('vital_signs')
    .select('*')
    .eq('patient_id', patientId)
    .order('timestamp', { ascending: false })
    .limit(10); // Get last 10 vital sign recordings

  // Fetch medications
  const { data: medications } = await supabase
    .from('medications')
    .select('*')
    .eq('patient_id', patientId)
    .order('prescribed_date', { ascending: false });

  // Fetch test results
  const { data: testResults } = await supabase
    .from('test_results')
    .select('*')
    .eq('patient_id', patientId)
    .order('requested_date', { ascending: false })
    .limit(20); // Get last 20 test results

  // Fetch MHA sections
  const { data: mhaSections } = await supabase
    .from('mha_sections')
    .select('*')
    .eq('patient_id', patientId)
    .order('applied_date', { ascending: false });

  return {
    gpDetails,
    relatedPeople,
    historicAddresses,
    pharmacies,
    allergies,
    reasonableAdjustments,
    // Phase 2: Medical History Data
    vitalSigns,
    medications,
    testResults,
    mhaSections
  };
};
