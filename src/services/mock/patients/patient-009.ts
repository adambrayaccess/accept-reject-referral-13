
import { Patient } from '@/types/patient';
import { PatientDataGenerator } from './patientDataGenerator';

// Generate patient using the data generator
export const patient009: Patient = PatientDataGenerator.generatePatient(3);
