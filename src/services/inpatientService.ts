import { supabase } from '@/integrations/supabase/client';

export interface InpatientAdmission {
  id: string;
  patient_id: string;
  referral_id?: string;
  ward_name: string;
  bed_number?: string;
  bay_number?: string;
  admission_datetime: string;
  admission_reason: string;
  current_status: 'Active' | 'Discharged' | 'Transferred';
  discharge_datetime?: string;
  consultant?: string;
  specialty?: string;
  notes?: string;
  admitted_by: string;
  created_at: string;
  updated_at: string;
}

export const createInpatientAdmission = async (admission: {
  patient_id: string;
  referral_id?: string;
  ward_name: string;
  bed_number?: string;
  bay_number?: string;
  admission_reason: string;
  consultant?: string;
  specialty?: string;
  notes?: string;
  admitted_by: string;
}): Promise<InpatientAdmission | null> => {
  try {
    const { data, error } = await supabase
      .from('inpatient_admissions')
      .insert([admission])
      .select()
      .single();

    if (error) {
      console.error('Error creating inpatient admission:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating inpatient admission:', error);
    return null;
  }
};

export const getInpatientAdmissionsByPatientId = async (
  patientId: string
): Promise<InpatientAdmission[]> => {
  try {
    const { data, error } = await supabase
      .from('inpatient_admissions')
      .select('*')
      .eq('patient_id', patientId)
      .order('admission_datetime', { ascending: false });

    if (error) {
      console.error('Error fetching inpatient admissions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching inpatient admissions:', error);
    return [];
  }
};

export const updateInpatientAdmissionStatus = async (
  admissionId: string,
  status: 'Active' | 'Discharged' | 'Transferred',
  dischargeDateTime?: string
): Promise<boolean> => {
  try {
    const updates: any = {
      current_status: status,
      updated_at: new Date().toISOString()
    };

    if (dischargeDateTime) {
      updates.discharge_datetime = dischargeDateTime;
    }

    const { error } = await supabase
      .from('inpatient_admissions')
      .update(updates)
      .eq('id', admissionId);

    if (error) {
      console.error('Error updating inpatient admission status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating inpatient admission status:', error);
    return false;
  }
};