
import { supabase } from '@/integrations/supabase/client'
import { mockPatients } from '@/services/mock/patients'
import { mockPractitioners } from '@/services/mock/practitioners'
import { mockReferrals } from '@/services/mock/referrals'
import type { Database } from '@/integrations/supabase/types'

type PatientInsert = Database['public']['Tables']['patients']['Insert']
type PractitionerInsert = Database['public']['Tables']['practitioners']['Insert']
type ReferralInsert = Database['public']['Tables']['referrals']['Insert']
type AllergyInsert = Database['public']['Tables']['allergies']['Insert']
type MedicationInsert = Database['public']['Tables']['medications']['Insert']
type TestResultInsert = Database['public']['Tables']['test_results']['Insert']
type VitalSignInsert = Database['public']['Tables']['vital_signs']['Insert']
type MHASectionInsert = Database['public']['Tables']['mha_sections']['Insert']

// Create UUID mapping for mock IDs
const createIdMapping = (mockIds: string[]): Record<string, string> => {
  const mapping: Record<string, string> = {}
  mockIds.forEach(mockId => {
    mapping[mockId] = crypto.randomUUID()
  })
  return mapping
}

// Map application triage status to database triage status
const mapTriageStatus = (triageStatus?: string): Database['public']['Enums']['triage_status'] | null => {
  if (!triageStatus) return null;
  
  switch (triageStatus) {
    case 'pre-assessment':
      return 'pending';
    case 'assessed':
      return 'in-progress';
    case 'pre-admission-assessment':
      return 'in-progress';
    case 'waiting-list':
      return 'waiting-list';
    case 'refer-to-another-specialty':
      return 'completed';
    default:
      return 'pending';
  }
};

// Map allergy severity to database enum
const mapAllergySeverity = (severity: string): Database['public']['Enums']['allergy_severity'] => {
  switch (severity) {
    case 'mild':
      return 'mild';
    case 'moderate':
      return 'moderate';
    case 'severe':
      return 'severe';
    case 'life-threatening':
      return 'life-threatening';
    default:
      return 'mild';
  }
};

// Map allergy type to database enum
const mapAllergyType = (type: string): Database['public']['Enums']['allergy_type'] => {
  switch (type) {
    case 'drug':
      return 'drug';
    case 'food':
      return 'food';
    case 'environmental':
      return 'environmental';
    case 'contact':
      return 'contact';
    case 'other':
      return 'other';
    default:
      return 'other';
  }
};

// Map allergy status to database enum
const mapAllergyStatus = (status: string): Database['public']['Enums']['allergy_status'] => {
  switch (status) {
    case 'active':
      return 'active';
    case 'inactive':
      return 'inactive';
    case 'resolved':
      return 'resolved';
    default:
      return 'active';
  }
};

// Map verification status to database enum
const mapVerificationStatus = (status: string): Database['public']['Enums']['verification_status'] => {
  switch (status) {
    case 'confirmed':
      return 'confirmed';
    case 'suspected':
      return 'suspected';
    case 'unlikely':
      return 'unconfirmed';
    case 'refuted':
      return 'unconfirmed';
    default:
      return 'unconfirmed';
  }
};

// Map medication status to database enum
const mapMedicationStatus = (status: string): Database['public']['Enums']['medication_status'] => {
  switch (status) {
    case 'active':
      return 'active';
    case 'discontinued':
      return 'discontinued';
    case 'completed':
      return 'completed';
    case 'paused':
      return 'paused';
    default:
      return 'active';
  }
};

// Map test status to database enum
const mapTestStatus = (status: string): Database['public']['Enums']['test_status'] => {
  switch (status) {
    case 'pending':
      return 'requested';
    case 'in-progress':
      return 'in-progress';
    case 'completed':
      return 'completed';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'requested';
  }
};

// Map MHA status to database enum
const mapMHAStatus = (status: string): Database['public']['Enums']['mha_status'] => {
  switch (status) {
    case 'active':
      return 'active';
    case 'expired':
      return 'expired';
    case 'discharged':
      return 'discharged';
    case 'appealed':
      return 'appealed';
    default:
      return 'active';
  }
};

// Remove duplicates from an array based on a key function
const removeDuplicates = <T>(array: T[], keyFn: (item: T) => string): T[] => {
  const seen = new Set<string>();
  return array.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

export const dataMigration = {
  async migratePatients(): Promise<Record<string, string>> {
    console.log('Migrating patients...')
    
    // Create UUID mapping for patient IDs
    const patientIds = mockPatients.map(p => p.id)
    const patientIdMapping = createIdMapping(patientIds)
    
    // Remove duplicates by NHS number
    const uniquePatients = removeDuplicates(mockPatients, patient => patient.nhsNumber);
    console.log(`Filtered ${mockPatients.length} patients to ${uniquePatients.length} unique patients by NHS number`);
    
    const patientInserts: PatientInsert[] = uniquePatients.map(patient => ({
      id: patientIdMapping[patient.id],
      name: patient.name,
      birth_date: patient.birthDate,
      gender: patient.gender,
      nhs_number: patient.nhsNumber,
      address: patient.address,
      phone: patient.phone,
      pronouns: patient.pronouns
    }))

    // Insert patients one by one to handle any remaining conflicts gracefully
    let successCount = 0;
    for (const patient of patientInserts) {
      const { error } = await supabase
        .from('patients')
        .upsert(patient, { 
          onConflict: 'nhs_number',
          ignoreDuplicates: false 
        })
      
      if (error) {
        console.error('Error migrating patient:', patient.name, error)
        // Continue with next patient instead of failing completely
      } else {
        successCount++;
      }
    }

    console.log(`Migrated ${successCount} patients successfully`)
    return patientIdMapping
  },

  async migratePractitioners(): Promise<Record<string, string>> {
    console.log('Migrating practitioners...')
    
    // Create UUID mapping for practitioner IDs
    const practitionerIds = mockPractitioners.map(p => p.id)
    const practitionerIdMapping = createIdMapping(practitionerIds)
    
    const practitionerInserts: PractitionerInsert[] = mockPractitioners.map(practitioner => ({
      id: practitionerIdMapping[practitioner.id],
      name: practitioner.name,
      role: practitioner.role,
      organization: practitioner.organization,
      contact: practitioner.contact
    }))

    // Insert practitioners one by one to handle duplicates gracefully
    let successCount = 0;
    for (const practitioner of practitionerInserts) {
      const { error } = await supabase
        .from('practitioners')
        .upsert(practitioner, { onConflict: 'id' })
      
      if (error) {
        console.error('Error migrating practitioner:', practitioner.name, error)
        // Continue with next practitioner instead of failing completely
      } else {
        successCount++;
      }
    }

    console.log(`Migrated ${successCount} practitioners successfully`)
    return practitionerIdMapping
  },

  async migrateReferrals(patientIdMapping: Record<string, string>, practitionerIdMapping: Record<string, string>): Promise<void> {
    console.log('Migrating referrals...')
    
    // Create UUID mapping for referral IDs
    const referralIds = mockReferrals.map(r => r.id)
    const referralIdMapping = createIdMapping(referralIds)
    
    // Remove duplicates by UBRN to prevent the conflict error
    const uniqueReferrals = removeDuplicates(mockReferrals, referral => referral.ubrn);
    console.log(`Filtered ${mockReferrals.length} referrals to ${uniqueReferrals.length} unique referrals by UBRN`);
    
    const referralInserts: ReferralInsert[] = uniqueReferrals.map(referral => ({
      id: referralIdMapping[referral.id],
      ubrn: referral.ubrn,
      patient_id: patientIdMapping[referral.patient.id],
      referrer_id: practitionerIdMapping[referral.referrer.id],
      specialty: referral.specialty,
      service: referral.service,
      status: referral.status,
      priority: referral.priority,
      triage_status: mapTriageStatus(referral.triageStatus),
      reason: referral.clinicalInfo.reason,
      history: referral.clinicalInfo.history,
      diagnosis: referral.clinicalInfo.diagnosis,
      medications: referral.clinicalInfo.medications?.join(', '),
      allergies_info: referral.clinicalInfo.allergies?.join(', '),
      notes: referral.clinicalInfo.notes,
      parent_referral_id: referral.parentReferralId ? referralIdMapping[referral.parentReferralId] : null,
      is_sub_referral: referral.isSubReferral,
      ai_generated: referral.aiGenerated,
      confidence: referral.confidence,
      team_id: referral.teamId,
      assigned_hcp_id: referral.assignedHCPId,
      allocated_date: referral.allocatedDate,
      allocated_by: referral.allocatedBy,
      display_order: (referral as any).displayOrder || 0,
      created_at: referral.created
    }))

    // Insert referrals one by one to handle any remaining conflicts gracefully
    let successCount = 0;
    for (const referral of referralInserts) {
      const { error } = await supabase
        .from('referrals')
        .upsert(referral, { 
          onConflict: 'ubrn',
          ignoreDuplicates: false 
        })
      
      if (error) {
        console.error('Error migrating referral:', referral.ubrn, error)
        // Continue with next referral instead of failing completely
      } else {
        successCount++;
      }
    }

    console.log(`Migrated ${successCount} referrals successfully`)
  },

  async migrateAllergies(patientIdMapping: Record<string, string>): Promise<void> {
    console.log('Migrating allergies...')
    
    const allergyInserts: AllergyInsert[] = []
    
    // Extract allergies from all patients
    for (const patient of mockPatients) {
      if (patient.medicalHistory?.allergies) {
        for (const allergy of patient.medicalHistory.allergies) {
          allergyInserts.push({
            id: crypto.randomUUID(),
            patient_id: patientIdMapping[patient.id],
            allergen: allergy.allergen,
            type: mapAllergyType(allergy.type),
            severity: mapAllergySeverity(allergy.severity),
            status: mapAllergyStatus(allergy.status),
            reactions: JSON.parse(JSON.stringify(allergy.reactions)), // Convert to plain JSON
            onset_date: allergy.onsetDate,
            last_reaction_date: allergy.lastReactionDate,
            notes: allergy.notes,
            verification_status: mapVerificationStatus(allergy.verificationStatus),
            recorded_by: allergy.recordedBy,
            recorded_date: allergy.recordedDate
          })
        }
      }
    }

    let successCount = 0
    for (const allergy of allergyInserts) {
      const { error } = await supabase
        .from('allergies')
        .insert(allergy)
      
      if (error) {
        console.error('Error migrating allergy:', allergy.allergen, error)
      } else {
        successCount++
      }
    }

    console.log(`Migrated ${successCount} allergies successfully`)
  },

  async migrateMedications(patientIdMapping: Record<string, string>): Promise<void> {
    console.log('Migrating medications...')
    
    const medicationInserts: MedicationInsert[] = []
    
    // Extract medications from all patients
    for (const patient of mockPatients) {
      if (patient.medicalHistory?.medicationHistory) {
        for (const medication of patient.medicalHistory.medicationHistory) {
          medicationInserts.push({
            id: crypto.randomUUID(),
            patient_id: patientIdMapping[patient.id],
            name: medication.name,
            dosage: medication.dosage,
            frequency: medication.frequency,
            indication: medication.indication,
            status: mapMedicationStatus(medication.status),
            prescribed_date: medication.prescribedDate,
            end_date: medication.endDate,
            prescribed_by: medication.prescribedBy,
            notes: medication.notes
          })
        }
      }
    }

    let successCount = 0
    for (const medication of medicationInserts) {
      const { error } = await supabase
        .from('medications')
        .insert(medication)
      
      if (error) {
        console.error('Error migrating medication:', medication.name, error)
      } else {
        successCount++
      }
    }

    console.log(`Migrated ${successCount} medications successfully`)
  },

  async migrateTestResults(patientIdMapping: Record<string, string>): Promise<void> {
    console.log('Migrating test results...')
    
    const testResultInserts: TestResultInsert[] = []
    
    // Extract test results from all patients
    for (const patient of mockPatients) {
      if (patient.medicalHistory?.testResults) {
        for (const testResult of patient.medicalHistory.testResults) {
          testResultInserts.push({
            id: crypto.randomUUID(),
            patient_id: patientIdMapping[patient.id],
            test_name: testResult.testName,
            test_type: testResult.testType,
            requested_date: testResult.requestedDate,
            sample_date: testResult.sampleDate,
            report_date: testResult.reportDate,
            requested_by: testResult.requestedBy,
            performed_by: testResult.performedBy,
            status: mapTestStatus(testResult.status),
            results: testResult.results ? JSON.parse(JSON.stringify(testResult.results)) : null, // Convert to plain JSON
            interpretation: testResult.interpretation,
            notes: testResult.notes
          })
        }
      }
    }

    let successCount = 0
    for (const testResult of testResultInserts) {
      const { error } = await supabase
        .from('test_results')
        .insert(testResult)
      
      if (error) {
        console.error('Error migrating test result:', testResult.test_name, error)
      } else {
        successCount++
      }
    }

    console.log(`Migrated ${successCount} test results successfully`)
  },

  async migrateVitalSigns(patientIdMapping: Record<string, string>): Promise<void> {
    console.log('Migrating vital signs...')
    
    const vitalSignInserts: VitalSignInsert[] = []
    
    // Extract vital signs from all patients
    for (const patient of mockPatients) {
      if (patient.medicalHistory?.vitalSigns) {
        for (const vitalSign of patient.medicalHistory.vitalSigns) {
          vitalSignInserts.push({
            id: crypto.randomUUID(),
            patient_id: patientIdMapping[patient.id],
            timestamp: vitalSign.timestamp,
            news2: vitalSign.news2,
            temperature: vitalSign.temperature,
            heart_rate: vitalSign.heartRate,
            respiration: vitalSign.respiration,
            oxygen_saturation: vitalSign.oxygenSaturation,
            blood_pressure_systolic: vitalSign.bloodPressureSystolic,
            blood_pressure_diastolic: vitalSign.bloodPressureDiastolic
          })
        }
      }
    }

    let successCount = 0
    for (const vitalSign of vitalSignInserts) {
      const { error } = await supabase
        .from('vital_signs')
        .insert(vitalSign)
      
      if (error) {
        console.error('Error migrating vital sign:', vitalSign.timestamp, error)
      } else {
        successCount++
      }
    }

    console.log(`Migrated ${successCount} vital signs successfully`)
  },

  async migrateMHASections(patientIdMapping: Record<string, string>): Promise<void> {
    console.log('Migrating MHA sections...')
    
    const mhaSectionInserts: MHASectionInsert[] = []
    
    // Extract MHA sections from all patients
    for (const patient of mockPatients) {
      if (patient.medicalHistory?.mhaSections) {
        for (const mhaSection of patient.medicalHistory.mhaSections) {
          mhaSectionInserts.push({
            id: crypto.randomUUID(),
            patient_id: patientIdMapping[patient.id],
            section_number: mhaSection.sectionNumber,
            section_title: mhaSection.sectionTitle,
            applied_date: mhaSection.appliedDate,
            expiry_date: mhaSection.expiryDate,
            status: mapMHAStatus(mhaSection.status),
            consultant_responsible: mhaSection.consultantResponsible,
            hospital: mhaSection.hospital,
            reason: mhaSection.reason,
            review_date: mhaSection.reviewDate,
            notes: mhaSection.notes
          })
        }
      }
    }

    let successCount = 0
    for (const mhaSection of mhaSectionInserts) {
      const { error } = await supabase
        .from('mha_sections')
        .insert(mhaSection)
      
      if (error) {
        console.error('Error migrating MHA section:', mhaSection.section_title, error)
      } else {
        successCount++
      }
    }

    console.log(`Migrated ${successCount} MHA sections successfully`)
  },

  async migrateAll(): Promise<void> {
    try {
      // Migrate in order due to foreign key dependencies
      const patientIdMapping = await this.migratePatients()
      const practitionerIdMapping = await this.migratePractitioners()
      await this.migrateReferrals(patientIdMapping, practitionerIdMapping)
      
      // Migrate medical data
      await this.migrateAllergies(patientIdMapping)
      await this.migrateMedications(patientIdMapping)
      await this.migrateTestResults(patientIdMapping)
      await this.migrateVitalSigns(patientIdMapping)
      await this.migrateMHASections(patientIdMapping)
      
      console.log('Complete data migration finished successfully!')
      console.log('All patient medical data has been migrated to Supabase')
    } catch (error) {
      console.error('Data migration failed:', error)
      throw error
    }
  },

  async clearAllData(): Promise<void> {
    console.log('Clearing all data...')
    
    // Delete in reverse order due to foreign key constraints
    await supabase.from('mha_sections').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('vital_signs').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('test_results').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('medications').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('allergies').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('referrals').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('practitioners').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('patients').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    console.log('All data cleared')
  }
}
