
import { Patient } from '@/types/patient';
import { PatientDataGenerator } from './patientDataGenerator';

// Generate patient using the data generator
export const patient013: Patient = PatientDataGenerator.generatePatient(7);
