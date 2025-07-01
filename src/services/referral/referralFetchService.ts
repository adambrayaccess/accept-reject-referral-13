
import { supabase } from '@/integrations/supabase/client';
import { Referral } from '@/types/referral';

// Get all referrals from Supabase
export const fetchReferrals = async (): Promise<Referral[]> => {
  try {
    const { data: referrals, error } = await supabase
      .from('referrals')
      .select(`
        *,
        patient:patients(*),
        referrer:practitioners(*),
        attachments(*),
        audit_log(*),
        collaboration_notes(*),
        referral_tags(tag),
        appointments(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching referrals:', error);
      return [];
    }

    return (referrals || []).map(transformReferralData);
  } catch (error) {
    console.error('Error in fetchReferrals:', error);
    return [];
  }
};

// Get single referral by ID from Supabase
export const fetchReferralById = async (id: string): Promise<Referral | null> => {
  try {
    const { data: referral, error } = await supabase
      .from('referrals')
      .select(`
        *,
        patient:patients(
          *,
          gp_details(*),
          related_people(*),
          historic_addresses(*),
          pharmacy_details(*),
          allergies(*),
          reasonable_adjustments(
            *,
            adjustment_details(*)
          )
        ),
        referrer:practitioners(*),
        attachments(*),
        audit_log(*),
        collaboration_notes(*),
        referral_tags(tag),
        appointments(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching referral:', error);
      return null;
    }

    if (!referral) return null;

    return transformReferralData(referral);
  } catch (error) {
    console.error('Error in fetchReferralById:', error);
    return null;
  }
};

// Get all referrals for a patient from Supabase
export const fetchPatientReferrals = async (patientId: string): Promise<Referral[]> => {
  try {
    const { data: referrals, error } = await supabase
      .from('referrals')
      .select(`
        *,
        patient:patients(*),
        referrer:practitioners(*),
        attachments(*),
        audit_log(*),
        collaboration_notes(*),
        referral_tags(tag),
        appointments(*)
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching patient referrals:', error);
      return [];
    }

    return (referrals || []).map(transformReferralData);
  } catch (error) {
    console.error('Error in fetchPatientReferrals:', error);
    return [];
  }
};

// Get child referrals for a parent referral from Supabase
export const fetchChildReferrals = async (parentReferralId: string): Promise<Referral[]> => {
  try {
    const { data: referrals, error } = await supabase
      .from('referrals')
      .select(`
        *,
        patient:patients(*),
        referrer:practitioners(*),
        attachments(*),
        audit_log(*),
        collaboration_notes(*),
        referral_tags(tag),
        appointments(*)
      `)
      .eq('parent_referral_id', parentReferralId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching child referrals:', error);
      return [];
    }

    return (referrals || []).map(transformReferralData);
  } catch (error) {
    console.error('Error in fetchChildReferrals:', error);
    return [];
  }
};

// Get parent referral for a child referral from Supabase
export const fetchParentReferral = async (childReferralId: string): Promise<Referral | null> => {
  try {
    // First get the child referral to find the parent ID
    const { data: childReferral, error: childError } = await supabase
      .from('referrals')
      .select('parent_referral_id')
      .eq('id', childReferralId)
      .single();

    if (childError || !childReferral?.parent_referral_id) {
      return null;
    }

    // Then fetch the parent referral
    return await fetchReferralById(childReferral.parent_referral_id);
  } catch (error) {
    console.error('Error in fetchParentReferral:', error);
    return null;
  }
};

// Transform database referral data to match our Referral interface
const transformReferralData = (dbReferral: any): Referral => {
  // Transform patient data including reasonable adjustments
  const transformedPatient = {
    id: dbReferral.patient.id,
    name: dbReferral.patient.name,
    birthDate: dbReferral.patient.birth_date,
    gender: dbReferral.patient.gender || 'unknown',
    nhsNumber: dbReferral.patient.nhs_number,
    address: dbReferral.patient.address || undefined,
    phone: dbReferral.patient.phone || undefined,
    pronouns: dbReferral.patient.pronouns || undefined,
    ethnicity: dbReferral.patient.ethnicity || undefined,
    accommodationType: dbReferral.patient.accommodation_type || undefined,
    gpDetails: dbReferral.patient.gp_details ? {
      id: dbReferral.patient.gp_details.id,
      name: dbReferral.patient.gp_details.name,
      practice: dbReferral.patient.gp_details.practice,
      address: dbReferral.patient.gp_details.address,
      phone: dbReferral.patient.gp_details.phone,
      email: dbReferral.patient.gp_details.email || undefined
    } : undefined,
    relatedPeople: dbReferral.patient.related_people ? dbReferral.patient.related_people.map((person: any) => ({
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
    historicAddresses: dbReferral.patient.historic_addresses ? dbReferral.patient.historic_addresses.map((addr: any) => ({
      id: addr.id,
      address: addr.address,
      dateFrom: addr.date_from,
      dateTo: addr.date_to || undefined,
      type: addr.address_type as 'residential' | 'temporary' | 'correspondence'
    })) : undefined,
    pharmacies: dbReferral.patient.pharmacy_details ? dbReferral.patient.pharmacy_details.map((pharmacy: any) => ({
      id: pharmacy.id,
      name: pharmacy.name,
      address: pharmacy.address,
      phone: pharmacy.phone,
      email: pharmacy.email || undefined,
      type: pharmacy.pharmacy_type as 'nominated' | 'linked'
    })) : undefined,
    accessRestriction: dbReferral.patient.access_restriction_enabled ? {
      isRestricted: true,
      level: dbReferral.patient.access_restriction_level as 'standard' | 'high' | 'maximum' | undefined,
      reason: dbReferral.patient.access_restriction_reason || undefined,
      appliedDate: dbReferral.patient.access_restriction_applied_date || undefined,
      appliedBy: dbReferral.patient.access_restriction_applied_by || undefined,
      reviewDate: dbReferral.patient.access_restriction_review_date || undefined,
      notes: dbReferral.patient.access_restriction_notes || undefined
    } : { isRestricted: false },
    medicalHistory: dbReferral.patient.allergies ? {
      allergies: dbReferral.patient.allergies.map((allergy: any) => ({
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
      })),
      vitalSigns: []
    } : { allergies: [], vitalSigns: [] },
    reasonableAdjustments: dbReferral.patient.reasonable_adjustments ? {
      hasAdjustments: dbReferral.patient.reasonable_adjustments.has_adjustments || false,
      flagLevel: dbReferral.patient.reasonable_adjustments.flag_level || 'none',
      lastUpdated: dbReferral.patient.reasonable_adjustments.last_updated || new Date().toISOString(),
      updatedBy: dbReferral.patient.reasonable_adjustments.updated_by || 'System',
      adjustments: dbReferral.patient.reasonable_adjustments.adjustment_details ? 
        dbReferral.patient.reasonable_adjustments.adjustment_details.map((detail: any) => ({
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

  return {
    id: dbReferral.id,
    ubrn: dbReferral.ubrn,
    created: dbReferral.created_at,
    status: dbReferral.status,
    priority: dbReferral.priority,
    patient: transformedPatient,
    referrer: {
      id: dbReferral.referrer.id,
      name: dbReferral.referrer.name,
      role: dbReferral.referrer.role || undefined,
      organization: dbReferral.referrer.organization || undefined,
      contact: dbReferral.referrer.contact || undefined
    },
    specialty: dbReferral.specialty,
    service: dbReferral.service || undefined,
    clinicalInfo: {
      reason: dbReferral.reason,
      history: dbReferral.history || undefined,
      diagnosis: dbReferral.diagnosis || undefined,
      medications: dbReferral.medications || undefined,
      allergiesInfo: dbReferral.allergies_info || undefined,
      notes: dbReferral.notes || undefined
    },
    attachments: (dbReferral.attachments || []).map((attachment: any) => ({
      id: attachment.id,
      filename: attachment.filename,
      fileType: attachment.file_type,
      fileSize: attachment.file_size || undefined,
      uploadedBy: attachment.uploaded_by,
      uploadedDate: attachment.uploaded_date,
      fileUrl: attachment.file_url || undefined
    })),
    auditLog: (dbReferral.audit_log || []).map((log: any) => ({
      id: log.id,
      action: log.action,
      timestamp: log.timestamp,
      userName: log.user_name,
      notes: log.notes || undefined
    })),
    collaborationNotes: (dbReferral.collaboration_notes || []).map((note: any) => ({
      id: note.id,
      author: note.author,
      content: note.content,
      timestamp: note.timestamp,
      isInternal: note.is_internal || false
    })),
    triageStatus: dbReferral.triage_status || undefined,
    tags: (dbReferral.referral_tags || []).map((tag: any) => tag.tag),
    parentReferralId: dbReferral.parent_referral_id || undefined,
    isSubReferral: dbReferral.is_sub_referral || false,
    aiGenerated: dbReferral.ai_generated || false,
    confidence: dbReferral.confidence || undefined,
    appointmentDetails: dbReferral.appointments && dbReferral.appointments.length > 0 ? {
      appointmentDate: dbReferral.appointments[0].appointment_date,
      appointmentTime: dbReferral.appointments[0].appointment_time,
      location: dbReferral.appointments[0].location,
      consultant: dbReferral.appointments[0].consultant,
      type: dbReferral.appointments[0].type,
      status: dbReferral.appointments[0].status,
      notes: dbReferral.appointments[0].notes || undefined
    } : undefined,
    teamId: dbReferral.team_id || undefined,
    assignedHCPId: dbReferral.assigned_hcp_id || undefined,
    allocatedDate: dbReferral.allocated_date || undefined,
    allocatedBy: dbReferral.allocated_by || undefined
  };
};
