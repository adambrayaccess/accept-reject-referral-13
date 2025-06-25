
import { supabase } from '@/integrations/supabase/client'
import { mockPatients } from '@/services/mock/patients'
import { mockPractitioners } from '@/services/mock/practitioners'
import { mockReferrals } from '@/services/mock/referrals'
import type { Database } from '@/integrations/supabase/types'

type PatientInsert = Database['public']['Tables']['patients']['Insert']
type PractitionerInsert = Database['public']['Tables']['practitioners']['Insert']
type ReferralInsert = Database['public']['Tables']['referrals']['Insert']

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

export const dataMigration = {
  async migratePatients(): Promise<void> {
    console.log('Migrating patients...')
    
    const patientInserts: PatientInsert[] = mockPatients.map(patient => ({
      id: patient.id,
      name: patient.name,
      birth_date: patient.birthDate,
      gender: patient.gender,
      nhs_number: patient.nhsNumber,
      address: patient.address,
      phone: patient.phone,
      pronouns: patient.pronouns
    }))

    const { error } = await supabase
      .from('patients')
      .upsert(patientInserts, { onConflict: 'id' })

    if (error) {
      console.error('Error migrating patients:', error)
      throw error
    }

    console.log(`Migrated ${patientInserts.length} patients`)
  },

  async migratePractitioners(): Promise<void> {
    console.log('Migrating practitioners...')
    
    const practitionerInserts: PractitionerInsert[] = mockPractitioners.map(practitioner => ({
      id: practitioner.id,
      name: practitioner.name,
      role: practitioner.role,
      organization: practitioner.organization,
      contact: practitioner.contact
    }))

    const { error } = await supabase
      .from('practitioners')
      .upsert(practitionerInserts, { onConflict: 'id' })

    if (error) {
      console.error('Error migrating practitioners:', error)
      throw error
    }

    console.log(`Migrated ${practitionerInserts.length} practitioners`)
  },

  async migrateReferrals(): Promise<void> {
    console.log('Migrating referrals...')
    
    const referralInserts: ReferralInsert[] = mockReferrals.map(referral => ({
      id: referral.id,
      ubrn: referral.ubrn,
      patient_id: referral.patient.id,
      referrer_id: referral.referrer.id,
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
      parent_referral_id: referral.parentReferralId,
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

    const { error } = await supabase
      .from('referrals')
      .upsert(referralInserts, { onConflict: 'id' })

    if (error) {
      console.error('Error migrating referrals:', error)
      throw error
    }

    console.log(`Migrated ${referralInserts.length} referrals`)
  },

  async migrateAll(): Promise<void> {
    try {
      // Migrate in order due to foreign key dependencies
      await this.migratePatients()
      await this.migratePractitioners()
      await this.migrateReferrals()
      
      console.log('Data migration completed successfully!')
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
