
import { supabase } from '@/integrations/supabase/client'
import { mockPatients } from '@/services/mock/patients'
import { mockPractitioners } from '@/services/mock/practitioners'
import { mockReferrals } from '@/services/mock/referrals'
import type { Database } from '@/integrations/supabase/types'

type PatientInsert = Database['public']['Tables']['patients']['Insert']
type PractitionerInsert = Database['public']['Tables']['practitioners']['Insert']
type ReferralInsert = Database['public']['Tables']['referrals']['Insert']

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

  async migrateAll(): Promise<void> {
    try {
      // Migrate in order due to foreign key dependencies
      const patientIdMapping = await this.migratePatients()
      const practitionerIdMapping = await this.migratePractitioners()
      await this.migrateReferrals(patientIdMapping, practitionerIdMapping)
      
      console.log('Data migration completed successfully!')
      console.log('ID mappings created for proper UUID handling')
    } catch (error) {
      console.error('Data migration failed:', error)
      throw error
    }
  },

  async clearAllData(): Promise<void> {
    console.log('Clearing all data...')
    
    // Delete in reverse order due to foreign key constraints
    await supabase.from('referrals').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('practitioners').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('patients').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    console.log('All data cleared')
  }
}
