import { Referral, Patient, FhirPractitioner } from '@/types/referral';
import { FhirIntegrationService } from './fhirIntegrationService';

export const mapPatient = (patient: any): Patient => ({
  id: patient.id,
  name: patient.name,
  birthDate: patient.birth_date,
  gender: patient.gender,
  nhsNumber: patient.nhs_number,
  address: patient.address,
  phone: patient.phone,
  // Add FHIR-related fields
  fhirId: patient.fhir_id,
  active: patient.active,
  maritalStatus: patient.marital_status_display,
  ethnicity: patient.ethnicity,
  pronouns: patient.pronouns,
  accommodationType: patient.accommodation_type,
  // Direct access allergies for clinical indicators
  allergies: patient.allergies?.map((allergy: any) => ({
    id: allergy.id,
    allergen: allergy.allergen,
    type: allergy.type,
    severity: allergy.severity,
    reactions: allergy.reactions,
    onsetDate: allergy.onset_date,
    lastReactionDate: allergy.last_reaction_date,
    status: allergy.status,
    verificationStatus: allergy.verification_status,
    recordedDate: allergy.recorded_date,
    recordedBy: allergy.recorded_by,
    notes: allergy.notes
  })) || [],
  // Medical history - structure all medical data under medicalHistory object
  medicalHistory: {
    allergies: patient.allergies?.map((allergy: any) => ({
      id: allergy.id,
      allergen: allergy.allergen,
      type: allergy.type,
      severity: allergy.severity,
      reactions: allergy.reactions,
      onsetDate: allergy.onset_date,
      lastReactionDate: allergy.last_reaction_date,
      status: allergy.status,
      verificationStatus: allergy.verification_status,
      recordedDate: allergy.recorded_date,
      recordedBy: allergy.recorded_by,
      notes: allergy.notes
    })) || [],
    vitalSigns: patient.vital_signs?.map((vital: any) => ({
      timestamp: vital.timestamp,
      bloodPressureSystolic: vital.blood_pressure_systolic,
      bloodPressureDiastolic: vital.blood_pressure_diastolic,
      heartRate: vital.heart_rate,
      respiration: vital.respiration,
      temperature: vital.temperature,
      oxygenSaturation: vital.oxygen_saturation,
      news2: vital.news2
    })) || [],
    medicationHistory: patient.medications?.map((med: any) => ({
      id: med.id,
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      prescribedDate: med.prescribed_date,
      prescribedBy: med.prescribed_by,
      endDate: med.end_date,
      status: med.status,
      indication: med.indication,
      notes: med.notes
    })) || [],
    testResults: patient.test_results?.map((test: any) => ({
      id: test.id,
      testName: test.test_name,
      testType: test.test_type,
      requestedDate: test.requested_date,
      requestedBy: test.requested_by,
      sampleDate: test.sample_date,
      performedBy: test.performed_by,
      reportDate: test.report_date,
      results: test.results || [],
      interpretation: test.interpretation,
      status: test.status,
      notes: test.notes
    })) || [],
    mhaSections: patient.mha_sections?.map((section: any) => ({
      id: section.id,
      sectionNumber: section.section_number,
      sectionTitle: section.section_title,
      appliedDate: section.applied_date,
      expiryDate: section.expiry_date,
      reviewDate: section.review_date,
      status: section.status,
      hospital: section.hospital,
      consultantResponsible: section.consultant_responsible,
      reason: section.reason,
      notes: section.notes
    })) || []
  },
  // GP details
  gpDetails: patient.gp_details ? {
    id: patient.gp_details.id,
    name: patient.gp_details.name,
    practice: patient.gp_details.practice,
    address: patient.gp_details.address,
    phone: patient.gp_details.phone,
    email: patient.gp_details.email
  } : undefined,
  // Related people
  relatedPeople: patient.related_people?.map((person: any) => ({
    id: person.id,
    name: person.name,
    relationship: person.relationship,
    phone: person.phone,
    email: person.email,
    address: person.address,
    isPrimaryContact: person.is_primary_contact,
    isNextOfKin: person.is_next_of_kin,
    isEmergencyContact: person.is_emergency_contact
  })),
  // Pharmacies
  pharmacies: patient.pharmacy_details?.map((pharmacy: any) => ({
    id: pharmacy.id,
    name: pharmacy.name,
    address: pharmacy.address,
    phone: pharmacy.phone,
    email: pharmacy.email,
    type: pharmacy.pharmacy_type
  })),
  // Reasonable adjustments - handle array case from Supabase query
  reasonableAdjustments: (() => {
    const adjustments = Array.isArray(patient.reasonable_adjustments) ? 
      patient.reasonable_adjustments[0] : patient.reasonable_adjustments;
    
    return adjustments ? {
      hasAdjustments: adjustments.has_adjustments,
      flagLevel: adjustments.flag_level,
      lastUpdated: adjustments.last_updated,
      updatedBy: adjustments.updated_by,
      adjustments: adjustments.adjustment_details?.map((adj: any) => ({
        id: adj.id,
        category: adj.category,
        description: adj.description,
        specificNeeds: adj.specific_needs,
        implementationNotes: adj.implementation_notes,
        status: adj.status,
        dateRecorded: adj.date_recorded,
        recordedBy: adj.recorded_by,
        reviewDate: adj.review_date
      })) || []
    } : undefined;
  })(),
  // Access restriction
  accessRestriction: patient.access_restriction_enabled ? {
    isRestricted: patient.access_restriction_enabled,
    level: patient.access_restriction_level,
    reason: patient.access_restriction_reason,
    appliedBy: patient.access_restriction_applied_by,
    appliedDate: patient.access_restriction_applied_date,
    reviewDate: patient.access_restriction_review_date,
    notes: patient.access_restriction_notes
  } : undefined,
  // Historic addresses
  historicAddresses: patient.historic_addresses?.map((address: any) => ({
    id: address.id,
    address: address.address,
    dateFrom: address.date_from,
    dateTo: address.date_to,
    type: address.address_type
  }))
});

export const mapPractitioner = (practitioner: any): FhirPractitioner => ({
  id: practitioner.id,
  name: practitioner.name,
  role: practitioner.role,
  organization: practitioner.organization,
  contact: practitioner.contact,
  // Add FHIR-related fields
  fhirId: practitioner.fhir_id,
  active: practitioner.active,
  gender: practitioner.gender,
  birthDate: practitioner.birth_date
});

export const mapReferralData = (referral: any): Referral => {
  const mappedReferral: Referral = {
    id: referral.id,
    ubrn: referral.ubrn,
    created: referral.created_at,
    status: referral.status,
    priority: referral.priority,
    patient: mapPatient(referral.patient),
    referrer: mapPractitioner(referral.referrer),
    specialty: referral.specialty,
    service: referral.service,
    clinicalInfo: {
      reason: referral.reason,
      history: referral.history,
      diagnosis: referral.diagnosis,
      medications: referral.medications ? referral.medications.split(',').map((m: string) => m.trim()).filter(Boolean) : [],
      allergies: referral.allergies_info ? referral.allergies_info.split(',').map((a: string) => a.trim()).filter(Boolean) : [],
      notes: referral.notes
    },
    attachments: referral.attachments?.map((att: any) => ({
      id: att.id,
      title: att.filename,
      contentType: att.file_type,
      size: att.file_size,
      date: att.uploaded_date,
      url: att.file_url
    })) || [],
    auditLog: referral.audit_log?.map((log: any) => ({
      timestamp: log.timestamp,
      action: log.action,
      user: log.user_name,
      notes: log.notes
    })),
    collaborationNotes: referral.collaboration_notes?.map((note: any) => ({
      id: note.id,
      timestamp: note.timestamp,
      author: note.author,
      content: note.content,
      isInternal: note.is_internal
    })),
    triageStatus: referral.triage_status,
    tags: referral.referral_tags?.map((tag: any) => tag.tag) || [],
    parentReferralId: referral.parent_referral_id,
    isSubReferral: referral.is_sub_referral,
    aiGenerated: referral.ai_generated,
    confidence: referral.confidence,
    appointmentDetails: referral.appointments?.length > 0 ? {
      id: referral.appointments[0].id,
      appointmentDate: referral.appointments[0].appointment_date,
      appointmentTime: referral.appointments[0].appointment_time,
      type: referral.appointments[0].type,
      status: referral.appointments[0].status,
      location: referral.appointments[0].location,
      consultant: referral.appointments[0].consultant,
      notes: referral.appointments[0].notes
    } : undefined,
    // RTT and care pathway data from database
    rttPathway: referral.rtt_pathways?.length > 0 ? {
      id: referral.rtt_pathways[0].id,
      referralId: referral.rtt_pathways[0].referral_id,
      clockStart: referral.rtt_pathways[0].clock_start_date,
      targetDate: referral.rtt_pathways[0].target_date,
      status: referral.rtt_pathways[0].status,
      breachRisk: referral.rtt_pathways[0].breach_risk,
      daysRemaining: referral.rtt_pathways[0].days_remaining,
      pauseHistory: referral.rtt_pathways[0].pause_history || [],
      createdAt: referral.rtt_pathways[0].created_at,
      updatedAt: referral.rtt_pathways[0].updated_at,
    } : undefined,
    carePathway: referral.care_pathways?.length > 0 ? {
      id: referral.care_pathways[0].id,
      referralId: referral.care_pathways[0].referral_id,
      name: referral.care_pathways[0].name,
      status: referral.care_pathways[0].status,
      description: referral.care_pathways[0].description,
      targetTimeframe: referral.care_pathways[0].target_timeframe,
      priorityLevel: referral.care_pathways[0].priority_level,
      createdAt: referral.care_pathways[0].created_at,
      updatedAt: referral.care_pathways[0].updated_at,
    } : undefined,
    teamId: referral.team_id,
    assignedHCPId: referral.assigned_hcp_id,
    allocatedDate: referral.allocated_date,
    allocatedBy: referral.allocated_by,
    // Add FHIR-related fields
    fhirId: referral.fhir_id,
    intent: referral.intent,
    authoredOn: referral.authored_on,
    supportingInfo: referral.supporting_info,
    // Add display order
    displayOrder: referral.display_order,
    // Add administrative category
    administrativeCategory: referral.administrative_category,
    // Add overseas status
    overseasStatus: referral.overseas_status,
    // Add referral type
    referralType: referral.referral_type,
    // Add external reference
    externalReference: referral.external_reference,
    // Add CAMHS Service Tier
    camhsServiceTier: referral.camhs_service_tier,
    // Add patient area/care setting
    patientAreaCareSetting: referral.patient_area_care_setting,
    // Add originating specialty
    originatingSpecialty: referral.orginating_specialty,
    // Add originating team
    originatingTeam: referral.orginating_team,
    // Add referral source
    referralSource: referral.referral_source,
    // Add referring hospital
    referringHospital: referral.referring_hospital,
    // Add enquiry number
    enquiryNumber: referral.enquiry_number,
    // Initialize child referral IDs - preserve existing values from services or initialize as undefined
    childReferralIds: referral.childReferralIds || undefined
  };

  // DISABLED: Automatically sync to FHIR when mapping (for real-time sync)
  // This ensures FHIR resources are always up-to-date
  // FhirIntegrationService.handleReferralChange(mappedReferral).catch(error => {
  //   console.error('Background FHIR sync failed:', error);
  // });

  return mappedReferral;
};