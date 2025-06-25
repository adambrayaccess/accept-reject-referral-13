
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'
import type { Referral, ReferralStatus, ReferralPriority, TriageStatus } from '@/types/referral'
import { patientService } from './patientService'
import { practitionerService } from './practitionerService'

type ReferralRow = Database['public']['Tables']['referrals']['Row']
type ReferralInsert = Database['public']['Tables']['referrals']['Insert']

// Convert database row to Referral type
const mapReferralFromDB = async (row: ReferralRow): Promise<Referral> => {
  // Fetch related data
  const [patient, referrer] = await Promise.all([
    patientService.getById(row.patient_id),
    practitionerService.getById(row.referrer_id)
  ])

  if (!patient || !referrer) {
    throw new Error(`Missing related data for referral ${row.id}`)
  }

  return {
    id: row.id,
    ubrn: row.ubrn,
    created: row.created_at!,
    status: row.status as ReferralStatus,
    priority: row.priority as ReferralPriority,
    patient,
    referrer,
    specialty: row.specialty,
    service: row.service || undefined,
    clinicalInfo: {
      reason: row.reason,
      history: row.history || undefined,
      diagnosis: row.diagnosis || undefined,
      medications: row.medications ? row.medications.split(',').map(m => m.trim()) : undefined,
      allergies: row.allergies_info ? row.allergies_info.split(',').map(a => a.trim()) : undefined,
      notes: row.notes || undefined
    },
    attachments: [], // Will be loaded separately
    triageStatus: row.triage_status as TriageStatus,
    tags: [], // Will be loaded separately
    parentReferralId: row.parent_referral_id || undefined,
    isSubReferral: row.is_sub_referral || false,
    aiGenerated: row.ai_generated || false,
    confidence: row.confidence ? Number(row.confidence) : undefined,
    teamId: row.team_id || undefined,
    assignedHCPId: row.assigned_hcp_id || undefined,
    allocatedDate: row.allocated_date || undefined,
    allocatedBy: row.allocated_by || undefined
  }
}

export const referralService = {
  async getAll(): Promise<Referral[]> {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching referrals:', error)
      throw error
    }

    // Map all referrals in parallel
    const referrals = await Promise.all(data.map(mapReferralFromDB))
    return referrals
  },

  async getById(id: string): Promise<Referral | null> {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      console.error('Error fetching referral:', error)
      throw error
    }

    return await mapReferralFromDB(data)
  },

  async getByPatientId(patientId: string): Promise<Referral[]> {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching patient referrals:', error)
      throw error
    }

    const referrals = await Promise.all(data.map(mapReferralFromDB))
    return referrals
  },

  async updateStatus(id: string, status: ReferralStatus): Promise<void> {
    const { error } = await supabase
      .from('referrals')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('Error updating referral status:', error)
      throw error
    }
  },

  async updateTriageStatus(id: string, triageStatus: TriageStatus): Promise<void> {
    const { error } = await supabase
      .from('referrals')
      .update({ triage_status: triageStatus })
      .eq('id', id)

    if (error) {
      console.error('Error updating triage status:', error)
      throw error
    }
  }
}
