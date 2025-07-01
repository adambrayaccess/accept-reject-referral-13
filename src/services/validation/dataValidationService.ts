
import { Referral, Patient, FhirPractitioner } from '@/types/referral';

export class DataValidationService {
  /**
   * Validate referral data before FHIR conversion
   */
  static validateReferralData(referral: Referral): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate basic referral fields
    if (!referral.id) errors.push('Referral ID is required');
    if (!referral.ubrn) errors.push('UBRN is required');
    if (!referral.specialty) errors.push('Specialty is required');
    if (!referral.clinicalInfo?.reason) errors.push('Clinical reason is required');

    // Validate patient data
    const patientValidation = this.validatePatientData(referral.patient);
    if (!patientValidation.isValid) {
      errors.push(...patientValidation.errors);
    }

    // Validate referrer data
    const referrerValidation = this.validatePractitionerData(referral.referrer);
    if (!referrerValidation.isValid) {
      errors.push(...referrerValidation.errors);
    }

    // Validate medications format
    if (referral.clinicalInfo?.medications) {
      const medications = referral.clinicalInfo.medications;
      if (Array.isArray(medications)) {
        // If it's already an array, validate each medication
        medications.forEach((med, index) => {
          if (typeof med === 'string' && med.trim().length === 0) {
            errors.push(`Medication ${index + 1} cannot be empty`);
          }
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate patient data
   */
  static validatePatientData(patient: Patient): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!patient.id) errors.push('Patient ID is required');
    if (!patient.name) errors.push('Patient name is required');
    if (!patient.birthDate) errors.push('Patient birth date is required');
    if (!patient.nhsNumber) errors.push('NHS number is required');

    // Validate NHS number format (basic check)
    if (patient.nhsNumber && !/^\d{10}$/.test(patient.nhsNumber.replace(/\s/g, ''))) {
      errors.push('NHS number must be 10 digits');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate practitioner data
   */
  static validatePractitionerData(practitioner: FhirPractitioner): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!practitioner.id) errors.push('Practitioner ID is required');
    if (!practitioner.name) errors.push('Practitioner name is required');

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate FHIR resource data
   */
  static validateFhirResource(resourceType: string, resourceData: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!resourceData.resourceType) {
      errors.push('Resource type is required');
    } else if (resourceData.resourceType !== resourceType) {
      errors.push(`Resource type mismatch: expected ${resourceType}, got ${resourceData.resourceType}`);
    }

    if (!resourceData.id) {
      errors.push('Resource ID is required');
    }

    // Validate meta information
    if (!resourceData.meta) {
      errors.push('Meta information is required');
    } else {
      if (!resourceData.meta.lastUpdated) {
        errors.push('Meta.lastUpdated is required');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
