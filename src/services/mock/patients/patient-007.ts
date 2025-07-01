
import { Patient } from '@/types/patient';
import { PatientDataGenerator } from './patientDataGenerator';

// Generate patient using the data generator
export const patient007: Patient = PatientDataGenerator.generatePatient(1);
