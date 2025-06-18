
import { MedicationPrescription } from '@/types/medical';

export const createMedicationHistory = (
  patientId: string,
  doctorName: string,
  conditions: Array<'hypertension' | 'diabetes' | 'depression' | 'contraception' | 'cholesterol'>,
  baseDate: string
): MedicationPrescription[] => {
  const medications: MedicationPrescription[] = [];
  const baseTimestamp = new Date(baseDate);

  const medicationTemplates = {
    hypertension: [
      {
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        indication: 'Hypertension',
        notes: 'Monitor blood pressure monthly'
      },
      {
        name: 'Amlodipine',
        dosage: '5mg',
        frequency: 'Once daily',
        indication: 'Hypertension',
        notes: 'Monitor for ankle swelling'
      },
      {
        name: 'Ramipril',
        dosage: '2.5mg',
        frequency: 'Once daily',
        indication: 'Hypertension',
        notes: 'Monitor kidney function'
      }
    ],
    diabetes: [
      {
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily with meals',
        indication: 'Type 2 Diabetes',
        notes: 'Take with food to reduce GI side effects'
      }
    ],
    depression: [
      {
        name: 'Sertraline',
        dosage: '50mg',
        frequency: 'Once daily in morning',
        indication: 'Depression and anxiety',
        notes: 'Monitor response and side effects'
      }
    ],
    contraception: [
      {
        name: 'Microgynon 30',
        dosage: '1 tablet',
        frequency: 'Once daily',
        indication: 'Contraception',
        notes: 'Take at the same time each day'
      }
    ],
    cholesterol: [
      {
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily at bedtime',
        indication: 'High cholesterol',
        notes: 'Monitor liver function tests'
      }
    ]
  };

  conditions.forEach((condition, index) => {
    const templates = medicationTemplates[condition];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    medications.push({
      id: `MED${patientId}${String(index + 1).padStart(2, '0')}`,
      name: template.name,
      dosage: template.dosage,
      frequency: template.frequency,
      prescribedDate: new Date(baseTimestamp.getTime() - (30 + index * 15) * 24 * 60 * 60 * 1000).toISOString(),
      prescribedBy: doctorName,
      indication: template.indication,
      status: 'active',
      notes: template.notes
    });
  });

  return medications;
};
