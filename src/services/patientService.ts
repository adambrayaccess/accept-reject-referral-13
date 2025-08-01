import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/types/patient';

export interface PatientSearchResult {
  patient: Patient;
  score: number;
}

export const searchPatients = async (query: string): Promise<PatientSearchResult[]> => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    console.log('Searching patients in database with query:', query);
    
    // Clean and normalize the search query
    const cleanQuery = query.trim();
    const searchTerm = `%${cleanQuery}%`;
    
    // Create a more sophisticated search that handles:
    // 1. Full name matches (split by space for first/last name)
    // 2. NHS number searches (with or without spaces)
    // 3. Phone number searches
    const nhsNumberSearch = cleanQuery.replace(/\s+/g, ''); // Remove spaces for NHS number search
    
    const { data: patients, error } = await supabase
      .from('patients')
      .select('*')
      .or(`name.ilike.${searchTerm},nhs_number.ilike.%${nhsNumberSearch}%,phone.ilike.${searchTerm}`)
      .eq('active', true)
      .order('name', { ascending: true })
      .limit(20); // Increased limit for better results

    if (error) {
      console.error('Error searching patients:', error);
      return [];
    }

    console.log(`Found ${patients?.length || 0} patients matching "${query}"`);

    // Convert database patients to Patient interface and assign relevance scores
    const results: PatientSearchResult[] = patients?.map(dbPatient => {
      const patient: Patient = {
        id: dbPatient.id,
        name: dbPatient.name,
        birthDate: dbPatient.birth_date,
        gender: dbPatient.gender,
        nhsNumber: dbPatient.nhs_number,
        address: dbPatient.address,
        phone: dbPatient.phone,
        fhirId: dbPatient.fhir_id,
        active: dbPatient.active,
        maritalStatus: dbPatient.marital_status_display,
        ethnicity: dbPatient.ethnicity,
        pronouns: dbPatient.pronouns,
        accommodationType: dbPatient.accommodation_type
      };

      // Calculate relevance score based on match quality
      const queryLower = cleanQuery.toLowerCase();
      const nameLower = patient.name.toLowerCase();
      const nhsNumberClean = patient.nhsNumber.replace(/\s+/g, '');
      const queryNhsClean = cleanQuery.replace(/\s+/g, '');
      
      let score = 0;

      // Exact name match gets highest score
      if (nameLower === queryLower) {
        score = 1.0;
      }
      // Name starts with query (common for name searches)
      else if (nameLower.startsWith(queryLower)) {
        score = 0.95;
      }
      // Name contains query
      else if (nameLower.includes(queryLower)) {
        score = 0.9;
      }
      // Exact NHS number match
      else if (nhsNumberClean === queryNhsClean || patient.nhsNumber === cleanQuery) {
        score = 0.98;
      }
      // NHS number contains query
      else if (nhsNumberClean.includes(queryNhsClean)) {
        score = 0.85;
      }
      // Phone number match
      else if (patient.phone?.includes(cleanQuery)) {
        score = 0.8;
      }
      // Fallback for partial matches
      else {
        score = 0.5;
      }

      return { patient, score };
    }) || [];

    // Sort by relevance score
    results.sort((a, b) => b.score - a.score);

    return results;
  } catch (error) {
    console.error('Error in patient search:', error);
    return [];
  }
};

export const createPatient = async (patientData: Omit<Patient, 'id'>): Promise<Patient | null> => {
  try {
    console.log('Creating new patient:', patientData);

    const { data: newPatient, error } = await supabase
      .from('patients')
      .insert({
        name: patientData.name,
        birth_date: patientData.birthDate,
        gender: patientData.gender,
        nhs_number: patientData.nhsNumber,
        address: patientData.address,
        phone: patientData.phone,
        ethnicity: patientData.ethnicity,
        pronouns: patientData.pronouns,
        accommodation_type: patientData.accommodationType,
        active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating patient:', error);
      return null;
    }

    console.log('Successfully created patient:', newPatient.id);

    return {
      id: newPatient.id,
      name: newPatient.name,
      birthDate: newPatient.birth_date,
      gender: newPatient.gender,
      nhsNumber: newPatient.nhs_number,
      address: newPatient.address,
      phone: newPatient.phone,
      fhirId: newPatient.fhir_id,
      active: newPatient.active,
      maritalStatus: newPatient.marital_status_display,
      ethnicity: newPatient.ethnicity,
      pronouns: newPatient.pronouns,
      accommodationType: newPatient.accommodation_type
    };
  } catch (error) {
    console.error('Error creating patient:', error);
    return null;
  }
};

export const fetchPatientById = async (id: string): Promise<Patient | null> => {
  try {
    const { data: patient, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .eq('active', true)
      .single();

    if (error || !patient) {
      console.error('Error fetching patient by ID:', error);
      return null;
    }

    return {
      id: patient.id,
      name: patient.name,
      birthDate: patient.birth_date,
      gender: patient.gender,
      nhsNumber: patient.nhs_number,
      address: patient.address,
      phone: patient.phone,
      fhirId: patient.fhir_id,
      active: patient.active,
      maritalStatus: patient.marital_status_display,
      ethnicity: patient.ethnicity,
      pronouns: patient.pronouns,
      accommodationType: patient.accommodation_type
    };
  } catch (error) {
    console.error('Error fetching patient by ID:', error);
    return null;
  }
};