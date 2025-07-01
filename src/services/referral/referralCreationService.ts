
import { supabase } from '@/integrations/supabase/client';
import { Referral } from '@/types/referral';
import { Patient } from '@/types/patient';
import { generateReferralId } from '@/utils/referralIdGenerator';
import { FhirSyncService } from '@/services/fhir/fhirSyncService';

export interface ReferralCreationData {
  // Basic referral information
  priority: string;
  specialty: string;
  service?: string;
  practitionerId: string;
  
  // Patient information
  patient: Patient;
  
  // Clinical information
  reason: string;
  history?: string;
  diagnosis?: string;
  medications?: string[];
  allergies?: string[];
  notes?: string;
  
  // Documents
  attachments?: any[];
  
  // Additional metadata
  aiGenerated?: boolean;
  confidence?: number;
}

export class ReferralCreationService {
  /**
   * Create a new referral with comprehensive data integration
   */
  static async createReferral(data: ReferralCreationData): Promise<{ success: boolean; referral?: Referral; error?: string }> {
    try {
      console.log('🚀 Phase 3: Creating enhanced referral with comprehensive data');
      
      // Generate UBRN
      const ubrn = generateReferralId();
      
      // Get practitioner details
      const { data: practitioner, error: practitionerError } = await supabase
        .from('practitioners')
        .select('*')
        .eq('id', data.practitionerId)
        .single();

      if (practitionerError || !practitioner) {
        return { success: false, error: 'Practitioner not found' };
      }

      // Ensure patient exists in database or create if needed
      const patientId = await this.ensurePatientExists(data.patient);
      if (!patientId) {
        return { success: false, error: 'Failed to create or find patient' };
      }

      // Create referral in database
      const { data: referralData, error: referralError } = await supabase
        .from('referrals') 
        .insert({
          ubrn,
          patient_id: patientId,
          referrer_id: data.practitionerId,
          priority: data.priority,
          specialty: data.specialty,
          service: data.service,
          reason: data.reason,
          history: data.history,
          diagnosis: data.diagnosis,
          medications: data.medications?.join(','),
          allergies_info: data.allergies?.join(','),
          notes: data.notes,
          status: 'new',
          ai_generated: data.aiGenerated || false,
          confidence: data.confidence,
          intent: 'order',
          authored_on: new Date().toISOString(),
        })
        .select()
        .single();

      if (referralError) {
        console.error('Error creating referral:', referralError);
        return { success: false, error: 'Failed to create referral' };
      }

      console.log('✅ Referral created in database:', referralData.id);

      // Create the complete referral object for return
      const completedReferral: Referral = {
        id: referralData.id,
        ubrn: referralData.ubrn,
        created: referralData.created_at,
        status: referralData.status,
        priority: referralData.priority,
        patient: data.patient,
        referrer: {
          id: practitioner.id,
          name: practitioner.name,
          role: practitioner.role,
          organization: practitioner.organization,
          contact: practitioner.contact,
          fhirId: practitioner.fhir_id,
          active: practitioner.active,
          gender: practitioner.gender,
          birthDate: practitioner.birth_date
        },
        specialty: referralData.specialty,
        service: referralData.service,
        clinicalInfo: {
          reason: referralData.reason,
          history: referralData.history,
          diagnosis: referralData.diagnosis,
          medications: data.medications || [],
          allergies: data.allergies || [],
          notes: referralData.notes
        },
        attachments: data.attachments || [],
        triageStatus: referralData.triage_status,
        aiGenerated: referralData.ai_generated,
        confidence: referralData.confidence,
        fhirId: referralData.fhir_id,
        intent: referralData.intent,
        authoredOn: referralData.authored_on
      };

      // Sync to FHIR in background (don't wait for completion)
      this.syncToFhirInBackground(completedReferral);

      console.log('✅ Phase 3: Enhanced referral creation completed successfully');
      return { success: true, referral: completedReferral };

    } catch (error) {
      console.error('❌ Error in referral creation:', error);
      return { success: false, error: 'Unexpected error during referral creation' };
    }
  }

  /**
   * Ensure patient exists in database, create if needed
   */
  private static async ensurePatientExists(patient: Patient): Promise<string | null> {
    try {
      // Check if patient already exists
      const { data: existingPatient } = await supabase
        .from('patients')
        .select('id')
        .eq('id', patient.id)
        .single();

      if (existingPatient) {
        return existingPatient.id;
      }

      // Create new patient if doesn't exist
      const { data: newPatient, error } = await supabase
        .from('patients')
        .insert({
          id: patient.id,
          name: patient.name,
          birth_date: patient.birthDate,
          gender: patient.gender,
          nhs_number: patient.nhsNumber,
          address: patient.address,
          phone: patient.phone,
          ethnicity: patient.ethnicity,
          pronouns: patient.pronouns,
          accommodation_type: patient.accommodationType,
          fhir_id: patient.fhirId,
          active: patient.active !== undefined ? patient.active : true
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating patient:', error);
        return null;
      }

      return newPatient.id;
    } catch (error) {
      console.error('Error ensuring patient exists:', error);
      return null;
    }
  }

  /**
   * Sync referral to FHIR in background
   */
  private static async syncToFhirInBackground(referral: Referral): Promise<void> {
    try {
      console.log('🔄 Syncing referral to FHIR in background:', referral.id);
      await FhirSyncService.syncReferralToFhir(referral);
    } catch (error) {
      console.error('Error syncing referral to FHIR:', error);
      // Don't throw error - this is background operation
    }
  }

  /**
   * Get referral creation statistics
   */
  static async getCreationStatistics(): Promise<{
    totalReferrals: number;
    todayReferrals: number;
    aiGeneratedReferrals: number;
    lastCreated: string | null;
  }> {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Total referrals
      const { count: totalCount } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true });

      // Today's referrals
      const { count: todayCount } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lt('created_at', `${today}T23:59:59.999Z`);

      // AI generated referrals
      const { count: aiCount } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('ai_generated', true);

      // Last created
      const { data: lastReferral } = await supabase
        .from('referrals')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return {
        totalReferrals: totalCount || 0,
        todayReferrals: todayCount || 0,
        aiGeneratedReferrals: aiCount || 0,
        lastCreated: lastReferral?.created_at || null
      };
    } catch (error) {
      console.error('Error getting creation statistics:', error);
      return {
        totalReferrals: 0,
        todayReferrals: 0,
        aiGeneratedReferrals: 0,
        lastCreated: null
      };
    }
  }
}
