
import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/types/patient';

export const fetchPatientDemographics = async (patientId: string): Promise<Patient | null> => {
  try {
    // Fetch patient with all related data
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();

    if (patientError || !patient) {
      console.error('Error fetching patient:', patientError);
      return null;
    }

    // Fetch GP details
    const { data: gpDetails } = await supabase
      .from('gp_details')
      .select('*')
      .eq('patient_id', patientId)
      .single();

    // Fetch related people
    const { data: relatedPeople } = await supabase
      .from('related_people')
      .select('*')
      .eq('patient_id', patientId);

    // Fetch historic addresses
    const { data: historicAddresses } = await supabase
      .from('historic_addresses')
      .select('*')
      .eq('patient_id', patientId)
      .order('date_from', { ascending: false });

    // Fetch pharmacy details
    const { data: pharmacies } = await supabase
      .from('pharmacy_details')
      .select('*')
      .eq('patient_id', patientId);

    // Fetch allergies
    const { data: allergies } = await supabase
      .from('allergies')
      .select('*')
      .eq('patient_id', patientId);

    // Fetch reasonable adjustments
    const { data: reasonableAdjustments } = await supabase
      .from('reasonable_adjustments')
      .select(`
        *,
        adjustment_details:adjustment_details(*)
      `)
      .eq('patient_id', patientId)
      .single();

    // Transform the data to match our Patient interface
    const transformedPatient: Patient = {
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
      medicalHistory: allergies ? {
        allergies: allergies.map(allergy => ({
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
        vitalSigns: [] // Add empty array to satisfy interface requirement
      } : undefined,
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

    return transformedPatient;
  } catch (error) {
    console.error('Error in fetchPatientDemographics:', error);
    return null;
  }
};
