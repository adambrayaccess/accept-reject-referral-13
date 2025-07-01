
import { Patient } from '@/types/patient';

// Mock patient data to fall back to when database queries fail
export const getMockPatientData = (patientId: string): Patient | null => {
  // This would typically come from your mock data service
  // For now, return a basic patient structure
  const mockPatients: Record<string, Partial<Patient>> = {
    'P002': {
      id: 'P002',
      name: 'Sarah Johnson',
      birthDate: '1985-03-15',
      gender: 'female',
      nhsNumber: '123 456 7890',
      address: '123 Main Street, London, SW1A 1AA',
      phone: '+44 20 7946 0958'
    },
    'P003': {
      id: 'P003',
      name: 'Robert Taylor',
      birthDate: '1975-08-22',
      gender: 'male',
      nhsNumber: '987 654 3210',
      address: '456 Oak Avenue, Manchester, M1 1AA',
      phone: '+44 161 496 0123'
    }
  };

  const mockData = mockPatients[patientId];
  if (!mockData) return null;

  return {
    ...mockData,
    medicalHistory: {
      allergies: [],
      vitalSigns: []
    },
    accessRestriction: { isRestricted: false }
  } as Patient;
};
