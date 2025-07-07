import { supabase } from '@/integrations/supabase/client';

export interface Diagnosis {
  id: string;
  patient_id: string;
  icd10_code?: string;
  icd10_description?: string;
  clinical_description: string;
  status: 'active' | 'resolved' | 'suspected' | 'ruled_out' | 'chronic';
  severity?: 'mild' | 'moderate' | 'severe' | 'critical';
  diagnosed_date: string;
  resolved_date?: string;
  diagnosed_by: string;
  notes?: string;
  referral_id?: string;
  created_at: string;
  updated_at: string;
}

export const fetchPatientDiagnoses = async (patientId: string): Promise<Diagnosis[]> => {
  const { data, error } = await supabase
    .from('diagnoses')
    .select('*')
    .eq('patient_id', patientId)
    .order('diagnosed_date', { ascending: false });

  if (error) {
    console.error('Error fetching patient diagnoses:', error);
    throw error;
  }

  return data || [];
};

export const fetchReferralDiagnoses = async (referralId: string): Promise<Diagnosis[]> => {
  const { data, error } = await supabase
    .from('diagnoses')
    .select('*')
    .eq('referral_id', referralId)
    .order('diagnosed_date', { ascending: false });

  if (error) {
    console.error('Error fetching referral diagnoses:', error);
    throw error;
  }

  return data || [];
};