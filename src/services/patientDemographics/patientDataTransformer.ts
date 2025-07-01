
import { Patient } from '@/types/patient';

export const transformPatientData = (
  patient: any, 
  gpDetails: any, 
  relatedPeople: any[], 
  historicAddresses: any[], 
  pharmacies: any[], 
  allergies: any[], 
  reasonableAdjustments: any,
  // Phase 2: Medical History Parameters
  vitalSigns: any[] = [],
  medications: any[] = [],
  testResults: any[] = [],
  mhaSections: any[] = []
): Patient => {
  return {
    id: patient.id,
    name: patient.name,
    birthDate: patient.birth_date,
    gender: patient.gender || 'unknown',
    nhsNumber: patient.nhs_number,
    address: patient.address || undefined,
    phone: patient.phone || undefined,
    pronouns: patient.pronouns || undefined,
    ethnicity: patient.ethnicity || undefined,
    accommodationType: patient.accommodation_type || undefined,
    gpDetails: gpDetails ? {
      id: gpDetails.id,
      name: gpDetails.name,
      practice: gpDetails.practice,
      address: gpDetails.address,
      phone: gpDetails.phone,
      email: gpDetails.email || undefined
    } : undefined,
    relatedPeople: relatedPeople ? relatedPeople.map(person => ({
      id: person.id,
      name: person.name,
      relationship: person.relationship,
      phone: person.phone || undefined,
      email: person.email || undefined,
      address: person.address || undefined,
      isPrimaryContact: person.is_primary_contact || false,
      isNextOfKin: person.is_next_of_kin || false,
      isEmergencyContact: person.is_emergency_contact || false
    })) : undefined,
    historicAddresses: historicAddresses ? historicAddresses.map(addr => ({
      id: addr.id,
      address: addr.address,
      dateFrom: addr.date_from,
      dateTo: addr.date_to || undefined,
      type: addr.address_type as 'residential' | 'temporary' | 'correspondence'
    })) : undefined,
    pharmacies: pharmacies ? pharmacies.map(pharmacy => ({
      id: pharmacy.id,
      name: pharmacy.name,
      address: pharmacy.address,
      phone: pharmacy.phone,
      email: pharmacy.email || undefined,
      type: pharmacy.pharmacy_type as 'nominated' | 'linked'
    })) : undefined,
    accessRestriction: patient.access_restriction_enabled ? {
      isRestricted: true,
      level: patient.access_restriction_level as 'standard' | 'high' | 'maximum' | undefined,
      reason: patient.access_restriction_reason || undefined,
      appliedDate: patient.access_restriction_applied_date || undefined,
      appliedBy: patient.access_restriction_applied_by || undefined,
      reviewDate: patient.access_restriction_review_date || undefined,
      notes: patient.access_restriction_notes || undefined
    } : { isRestricted: false },
    
    // Phase 2: Enhanced Medical History Integration
    medicalHistory: {
      allergies: allergies ? allergies.map(allergy => ({
        id: allergy.id,
        allergen: allergy.allergen,
        type: allergy.type,
        severity: allergy.severity,
        reactions: allergy.reactions || [],
        onsetDate: allergy.onset_date || undefined,
        lastReactionDate: allergy.last_reaction_date || undefined,
        verificationStatus: allergy.verification_status || 'unconfirmed',
        recordedDate: allergy.recorded_date || undefined,
        recordedBy: allergy.recorded_by || undefined,
        notes: allergy.notes || undefined,
        status: allergy.status || 'active'
      })) : [],
      
      vitalSigns: vitalSigns ? vitalSigns.map(vital => ({
        id: vital.id,
        timestamp: vital.timestamp,
        bloodPressureSystolic: vital.blood_pressure_systolic,
        bloodPressureDiastolic: vital.blood_pressure_diastolic,
        heartRate: vital.heart_rate,
        temperature: vital.temperature ? parseFloat(vital.temperature) : undefined,
        respirationRate: vital.respiration,
        oxygenSaturation: vital.oxygen_saturation,
        news2Score: vital.news2
      })) : []
    },
    
    // Phase 2: Direct medication, test results, and MHA sections on patient
    medications: medications ? medications.map(med => ({
      id: med.id,
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      prescribedDate: med.prescribed_date,
      endDate: med.end_date || undefined,
      prescribedBy: med.prescribed_by,
      indication: med.indication || undefined,
      status: med.status || 'active',
      notes: med.notes || undefined
    })) : undefined,
    
    testResults: testResults ? testResults.map(test => ({
      id: test.id,
      testName: test.test_name,
      testType: test.test_type,
      requestedDate: test.requested_date,
      sampleDate: test.sample_date || undefined,
      reportDate: test.report_date || undefined,
      requestedBy: test.requested_by,
      performedBy: test.performed_by || undefined,
      results: test.results || undefined,
      interpretation: test.interpretation || undefined,
      status: test.status || 'requested',
      notes: test.notes || undefined
    })) : undefined,
    
    mhaSections: mhaSections ? mhaSections.map(section => ({
      id: section.id,
      sectionNumber: section.section_number,
      sectionTitle: section.section_title,
      appliedDate: section.applied_date,
      expiryDate: section.expiry_date || undefined,
      reviewDate: section.review_date || undefined,
      hospital: section.hospital,
      consultantResponsible: section.consultant_responsible,
      reason: section.reason,
      status: section.status,
      notes: section.notes || undefined
    })) : undefined,
    
    reasonableAdjustments: reasonableAdjustments ? {
      hasAdjustments: reasonableAdjustments.has_adjustments || false,
      flagLevel: reasonableAdjustments.flag_level || 'none',
      lastUpdated: reasonableAdjustments.last_updated || new Date().toISOString(),
      updatedBy: reasonableAdjustments.updated_by || 'System',
      adjustments: reasonableAdjustments.adjustment_details ? 
        reasonableAdjustments.adjustment_details.map((detail: any) => ({
          id: detail.id,
          category: detail.category,
          description: detail.description,
          specificNeeds: detail.specific_needs,
          implementationNotes: detail.implementation_notes || undefined,
          dateRecorded: detail.date_recorded || undefined,
          recordedBy: detail.recorded_by,
          reviewDate: detail.review_date || undefined,
          status: detail.status || 'active'
        })) : []
    } : undefined
  };
};
