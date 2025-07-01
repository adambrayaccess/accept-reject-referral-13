import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/types/patient';

export interface InsertionResult {
  patientId: string;
  success: boolean;
  error?: string;
  insertedTables: string[];
}

export interface InsertionSummary {
  totalPatients: number;
  successful: number;
  failed: number;
  results: InsertionResult[];
  tableStats: {
    [tableName: string]: {
      attempted: number;
      successful: number;
      failed: number;
    };
  };
}

export class PatientDatabaseInserter {
  private static async insertPatientCore(patient: Patient): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🔄 Inserting patient core data for: ${patient.id} (${patient.name})`);
      
      // Use the service role to bypass RLS for population
      const { error } = await supabase
        .from('patients')
        .insert({
          id: patient.id,
          name: patient.name,
          birth_date: patient.birthDate,
          gender: patient.gender,
          nhs_number: patient.nhsNumber,
          address: patient.address,
          phone: patient.phone,
          fhir_id: patient.fhirId,
          active: patient.active,
          marital_status_display: patient.maritalStatus,
          ethnicity: patient.ethnicity,
          accommodation_type: patient.accommodationType
        });

      if (error) {
        console.error(`❌ Error inserting patient core for ${patient.id}:`, error);
        return { success: false, error: error.message };
      }

      console.log(`✅ Successfully inserted patient core for: ${patient.id}`);
      return { success: true };
    } catch (error) {
      console.error(`💥 Exception inserting patient core for ${patient.id}:`, error);
      return { success: false, error: error.message };
    }
  }

  private static async insertGPDetails(patient: Patient): Promise<{ success: boolean; error?: string }> {
    if (!patient.gpDetails) return { success: true };

    try {
      const { error } = await supabase
        .from('gp_details')
        .insert({
          id: patient.gpDetails.id,
          patient_id: patient.id,
          name: patient.gpDetails.name,
          practice: patient.gpDetails.practice,
          address: patient.gpDetails.address,
          phone: patient.gpDetails.phone,
          email: patient.gpDetails.email
        });

      if (error) {
        console.error('Error inserting GP details:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Exception inserting GP details:', error);
      return { success: false, error: error.message };
    }
  }

  private static async insertPharmacyDetails(patient: Patient): Promise<{ success: boolean; error?: string }> {
    if (!patient.pharmacies || patient.pharmacies.length === 0) return { success: true };

    try {
      const pharmacyInserts = patient.pharmacies.map(pharmacy => ({
        id: pharmacy.id,
        patient_id: patient.id,
        name: pharmacy.name,
        address: pharmacy.address,
        phone: pharmacy.phone,
        email: pharmacy.email,
        pharmacy_type: pharmacy.type
      }));

      const { error } = await supabase
        .from('pharmacy_details')
        .insert(pharmacyInserts);

      if (error) {
        console.error('Error inserting pharmacy details:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Exception inserting pharmacy details:', error);
      return { success: false, error: error.message };
    }
  }

  private static async insertRelatedPeople(patient: Patient): Promise<{ success: boolean; error?: string }> {
    if (!patient.relatedPeople || patient.relatedPeople.length === 0) return { success: true };

    try {
      const relatedPeopleInserts = patient.relatedPeople.map(person => ({
        id: person.id,
        patient_id: patient.id,
        name: person.name,
        relationship: person.relationship,
        phone: person.phone,
        email: person.email,
        address: person.address,
        is_primary_contact: person.isPrimaryContact,
        is_next_of_kin: person.isNextOfKin,
        is_emergency_contact: person.isEmergencyContact
      }));

      const { error } = await supabase
        .from('related_people')
        .insert(relatedPeopleInserts);

      if (error) {
        console.error('Error inserting related people:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Exception inserting related people:', error);
      return { success: false, error: error.message };
    }
  }

  private static async insertHistoricAddresses(patient: Patient): Promise<{ success: boolean; error?: string }> {
    if (!patient.historicAddresses || patient.historicAddresses.length === 0) return { success: true };

    try {
      const addressInserts = patient.historicAddresses.map(address => ({
        id: address.id,
        patient_id: patient.id,
        address: address.address,
        date_from: address.dateFrom,
        date_to: address.dateTo,
        address_type: address.type
      }));

      const { error } = await supabase
        .from('historic_addresses')
        .insert(addressInserts);

      if (error) {
        console.error('Error inserting historic addresses:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Exception inserting historic addresses:', error);
      return { success: false, error: error.message };
    }
  }

  private static async insertVitalSigns(patient: Patient): Promise<{ success: boolean; error?: string }> {
    if (!patient.medicalHistory?.vitalSigns || patient.medicalHistory.vitalSigns.length === 0) return { success: true };

    try {
      const vitalSignsInserts = patient.medicalHistory.vitalSigns.map(vs => ({
        patient_id: patient.id,
        timestamp: vs.timestamp,
        news2: vs.news2,
        temperature: vs.temperature,
        heart_rate: vs.heartRate,
        respiration: vs.respiration,
        oxygen_saturation: vs.oxygenSaturation,
        blood_pressure_systolic: vs.bloodPressureSystolic,
        blood_pressure_diastolic: vs.bloodPressureDiastolic
      }));

      const { error } = await supabase
        .from('vital_signs')
        .insert(vitalSignsInserts);

      if (error) {
        console.error('Error inserting vital signs:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Exception inserting vital signs:', error);
      return { success: false, error: error.message };
    }
  }

  private static async insertMedications(patient: Patient): Promise<{ success: boolean; error?: string }> {
    if (!patient.medicalHistory?.medicationHistory || patient.medicalHistory.medicationHistory.length === 0) return { success: true };

    try {
      const medicationInserts = patient.medicalHistory.medicationHistory.map(med => ({
        id: med.id,
        patient_id: patient.id,
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        prescribed_date: med.prescribedDate,
        prescribed_by: med.prescribedBy,
        indication: med.indication,
        status: med.status,
        notes: med.notes,
        end_date: med.endDate
      }));

      const { error } = await supabase
        .from('medications')
        .insert(medicationInserts);

      if (error) {
        console.error('Error inserting medications:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Exception inserting medications:', error);
      return { success: false, error: error.message };
    }
  }

  private static async insertTestResults(patient: Patient): Promise<{ success: boolean; error?: string }> {
    if (!patient.medicalHistory?.testResults || patient.medicalHistory.testResults.length === 0) return { success: true };

    try {
      const testResultInserts = patient.medicalHistory.testResults.map(test => ({
        id: test.id,
        patient_id: patient.id,
        test_name: test.testName,
        test_type: test.testType,
        requested_date: test.requestedDate,
        sample_date: test.sampleDate,
        report_date: test.reportDate,
        requested_by: test.requestedBy,
        performed_by: test.performedBy,
        status: test.status,
        results: test.results,
        interpretation: test.interpretation,
        notes: test.notes
      }));

      const { error } = await supabase
        .from('test_results')
        .insert(testResultInserts);

      if (error) {
        console.error('Error inserting test results:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Exception inserting test results:', error);
      return { success: false, error: error.message };
    }
  }

  private static async insertAllergies(patient: Patient): Promise<{ success: boolean; error?: string }> {
    if (!patient.medicalHistory?.allergies || patient.medicalHistory.allergies.length === 0) return { success: true };

    try {
      const allergyInserts = patient.medicalHistory.allergies.map(allergy => ({
        id: allergy.id,
        patient_id: patient.id,
        allergen: allergy.allergen,
        type: allergy.type,
        severity: allergy.severity,
        reactions: allergy.reactions,
        onset_date: allergy.onsetDate,
        last_reaction_date: allergy.lastReactionDate,
        verification_status: allergy.verificationStatus,
        recorded_date: allergy.recordedDate,
        recorded_by: allergy.recordedBy,
        status: allergy.status,
        notes: allergy.notes
      }));

      const { error } = await supabase
        .from('allergies')
        .insert(allergyInserts);

      if (error) {
        console.error('Error inserting allergies:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Exception inserting allergies:', error);
      return { success: false, error: error.message };
    }
  }

  private static async insertReasonableAdjustments(patient: Patient): Promise<{ success: boolean; error?: string }> {
    if (!patient.reasonableAdjustments?.hasAdjustments) return { success: true };

    try {
      // Insert the reasonable adjustments flag
      const { data: raData, error: raError } = await supabase
        .from('reasonable_adjustments')
        .insert({
          patient_id: patient.id,
          has_adjustments: patient.reasonableAdjustments.hasAdjustments,
          flag_level: patient.reasonableAdjustments.flagLevel,
          last_updated: patient.reasonableAdjustments.lastUpdated,
          updated_by: patient.reasonableAdjustments.updatedBy
        })
        .select()
        .single();

      if (raError) {
        console.error('Error inserting reasonable adjustments:', raError);
        return { success: false, error: raError.message };
      }

      // Insert adjustment details if they exist
      if (patient.reasonableAdjustments.adjustments && patient.reasonableAdjustments.adjustments.length > 0) {
        const adjustmentInserts = patient.reasonableAdjustments.adjustments.map(adj => ({
          reasonable_adjustments_id: raData.id,
          category: adj.category,
          description: adj.description,
          specific_needs: adj.specificNeeds,
          implementation_notes: adj.implementationNotes,
          status: adj.status,
          date_recorded: adj.dateRecorded,
          recorded_by: adj.recordedBy,
          review_date: adj.reviewDate
        }));

        const { error: adjError } = await supabase
          .from('adjustment_details')
          .insert(adjustmentInserts);

        if (adjError) {
          console.error('Error inserting adjustment details:', adjError);
          return { success: false, error: adjError.message };
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Exception inserting reasonable adjustments:', error);
      return { success: false, error: error.message };
    }
  }

  static async insertPatient(patient: Patient): Promise<InsertionResult> {
    const result: InsertionResult = {
      patientId: patient.id,
      success: false,
      insertedTables: []
    };

    console.log(`📝 Starting insertion for patient: ${patient.id} (${patient.name})`);

    const insertionSteps = [
      { name: 'patients', fn: () => this.insertPatientCore(patient) },
      { name: 'gp_details', fn: () => this.insertGPDetails(patient) },
      { name: 'pharmacy_details', fn: () => this.insertPharmacyDetails(patient) },
      { name: 'related_people', fn: () => this.insertRelatedPeople(patient) },
      { name: 'historic_addresses', fn: () => this.insertHistoricAddresses(patient) },
      { name: 'vital_signs', fn: () => this.insertVitalSigns(patient) },
      { name: 'medications', fn: () => this.insertMedications(patient) },
      { name: 'test_results', fn: () => this.insertTestResults(patient) },
      { name: 'allergies', fn: () => this.insertAllergies(patient) },
      { name: 'reasonable_adjustments', fn: () => this.insertReasonableAdjustments(patient) }
    ];

    for (const step of insertionSteps) {
      try {
        console.log(`🔄 Processing step: ${step.name} for patient ${patient.id}`);
        const stepResult = await step.fn();
        if (stepResult.success) {
          result.insertedTables.push(step.name);
          console.log(`✅ Successfully completed step: ${step.name} for patient ${patient.id}`);
        } else {
          result.error = `Failed at ${step.name}: ${stepResult.error}`;
          console.error(`❌ Failed at step: ${step.name} for patient ${patient.id} - ${stepResult.error}`);
          return result;
        }
      } catch (error) {
        result.error = `Exception at ${step.name}: ${error.message}`;
        console.error(`💥 Exception at step: ${step.name} for patient ${patient.id}:`, error);
        return result;
      }
    }

    result.success = true;
    console.log(`🎉 Successfully inserted all data for patient: ${patient.id} (${patient.name})`);
    return result;
  }

  static async insertAllPatients(patients: Patient[]): Promise<InsertionSummary> {
    const summary: InsertionSummary = {
      totalPatients: patients.length,
      successful: 0,
      failed: 0,
      results: [],
      tableStats: {}
    };

    console.log(`🚀 Starting bulk patient insertion: ${patients.length} patients`);
    console.log(`📊 Using Supabase client for database operations`);

    for (const patient of patients) {
      console.log(`📝 Processing patient: ${patient.id} (${patient.name})`);
      
      const result = await this.insertPatient(patient);
      summary.results.push(result);

      if (result.success) {
        summary.successful++;
        console.log(`✅ Successfully inserted patient: ${patient.id}`);
      } else {
        summary.failed++;
        console.error(`❌ Failed to insert patient: ${patient.id} - ${result.error}`);
      }

      // Update table stats
      result.insertedTables.forEach(tableName => {
        if (!summary.tableStats[tableName]) {
          summary.tableStats[tableName] = { attempted: 0, successful: 0, failed: 0 };
        }
        summary.tableStats[tableName].attempted++;
        summary.tableStats[tableName].successful++;
      });
    }

    console.log(`🎯 Bulk insertion completed:`);
    console.log(`   Total: ${summary.totalPatients}`);
    console.log(`   Successful: ${summary.successful}`);
    console.log(`   Failed: ${summary.failed}`);
    console.log(`   Success Rate: ${Math.round((summary.successful / summary.totalPatients) * 100)}%`);

    return summary;
  }
}
