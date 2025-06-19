
import { mockReferrals } from '../mock/referrals';
import { mockPatients } from '../mock/patients';
import { Referral } from '@/types/referral';

export const fetchReferralById = async (id: string): Promise<Referral | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const referral = mockReferrals.find(r => r.id === id);
  if (!referral) {
    return null;
  }

  // Ensure we get the full patient data including medical history and allergies
  const fullPatient = mockPatients.find(p => p.id === referral.patient.id);
  if (fullPatient) {
    // Replace the referral's patient data with the complete patient data
    return {
      ...referral,
      patient: {
        ...fullPatient,
        // Ensure medical history including allergies is properly included
        medicalHistory: fullPatient.medicalHistory ? {
          ...fullPatient.medicalHistory,
          allergies: fullPatient.medicalHistory.allergies || []
        } : undefined
      }
    };
  }

  return referral;
};

export const fetchPatientReferrals = async (patientId: string): Promise<Referral[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const patientReferrals = mockReferrals.filter(r => r.patient.id === patientId);
  
  // Ensure each referral has complete patient data
  const fullPatient = mockPatients.find(p => p.id === patientId);
  if (fullPatient) {
    return patientReferrals.map(referral => ({
      ...referral,
      patient: {
        ...fullPatient,
        medicalHistory: fullPatient.medicalHistory ? {
          ...fullPatient.medicalHistory,
          allergies: fullPatient.medicalHistory.allergies || []
        } : undefined
      }
    }));
  }
  
  return patientReferrals;
};
