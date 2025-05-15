
import { SpecialtyOption, HealthcareProfessional } from '@/types/referral';

export const specialties: SpecialtyOption[] = [
  { id: 'card', name: 'Cardiology' },
  { id: 'derm', name: 'Dermatology' },
  { id: 'neur', name: 'Neurology' },
  { id: 'orth', name: 'Orthopedics' },
  { id: 'onco', name: 'Oncology' },
];

export const healthcareProfessionals: HealthcareProfessional[] = [
  { id: 'hp1', name: 'Dr. Sarah Jones', role: 'Consultant', specialty: 'card' },
  { id: 'hp2', name: 'Dr. Michael Chen', role: 'Specialist', specialty: 'card' },
  { id: 'hp3', name: 'Dr. Emma Wilson', role: 'Consultant', specialty: 'derm' },
  { id: 'hp4', name: 'Dr. James Smith', role: 'Specialist', specialty: 'derm' },
  { id: 'hp5', name: 'Dr. Lisa Brown', role: 'Consultant', specialty: 'neur' },
];
