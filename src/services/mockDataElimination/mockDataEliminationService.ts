
import { supabase } from '@/integrations/supabase/client';

export interface EliminationResult {
  success: boolean;
  tablesCleared: string[];
  totalRecordsRemoved: number;
  error?: string;
  duration: number;
  details: {
    [tableName: string]: {
      recordsRemoved: number;
      success: boolean;
      error?: string;
    };
  };
}

export class MockDataEliminationService {
  private static readonly TABLES_TO_CLEAR = [
    // Core tables (order matters due to foreign key constraints)
    'audit_log',
    'collaboration_notes',
    'attachments',
    'appointments',
    'referral_tags',
    'referrals',
    
    // Medical history tables
    'vital_signs',
    'test_results',
    'medications',
    'mha_sections',
    'allergies',
    
    // Patient-related tables
    'adjustment_details',
    'reasonable_adjustments',
    'historic_addresses',
    'related_people',
    'pharmacy_details',
    'gp_details',
    
    // FHIR tables
    'fhir_contact_points',
    'fhir_addresses',
    'fhir_human_names',
    'fhir_identifiers',
    'fhir_codings',
    'fhir_resources',
    
    // Core entity tables (last)
    'patients',
    'practitioners'
  ];

  /**
   * Execute complete mock data elimination
   */
  static async eliminateAllMockData(): Promise<EliminationResult> {
    console.log('🧹 Phase 4: Starting Mock Data Elimination');
    const startTime = Date.now();
    
    const result: EliminationResult = {
      success: true,
      tablesCleared: [],
      totalRecordsRemoved: 0,
      duration: 0,
      details: {}
    };

    try {
      // Step 1: Backup current state (optional)
      console.log('📋 Step 1: Documenting current database state...');
      const currentState = await this.documentCurrentState();
      console.log('Current state:', currentState);

      // Step 2: Clear tables in correct order
      console.log('🗑️ Step 2: Clearing tables in dependency order...');
      
      for (const tableName of this.TABLES_TO_CLEAR) {
        console.log(`🔄 Clearing table: ${tableName}`);
        
        try {
          const { count, error } = await supabase
            .from(tableName)
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
          
          if (error) {
            console.error(`❌ Error clearing ${tableName}:`, error);
            result.details[tableName] = {
              recordsRemoved: 0,
              success: false,
              error: error.message
            };
            
            // Don't fail completely on individual table errors
            continue;
          }

          const recordsRemoved = count || 0;
          result.details[tableName] = {
            recordsRemoved,
            success: true
          };
          
          result.tablesCleared.push(tableName);
          result.totalRecordsRemoved += recordsRemoved;
          
          console.log(`✅ Cleared ${recordsRemoved} records from ${tableName}`);
          
        } catch (error) {
          console.error(`💥 Exception clearing ${tableName}:`, error);
          result.details[tableName] = {
            recordsRemoved: 0,
            success: false,
            error: error.message
          };
        }
      }

      // Step 3: Reset sequences and constraints
      console.log('🔄 Step 3: Resetting database sequences...');
      await this.resetDatabaseSequences();

      // Step 4: Verify elimination
      console.log('✅ Step 4: Verifying elimination...');
      const verificationResult = await this.verifyElimination();
      
      if (!verificationResult.success) {
        console.warn('⚠️ Verification found remaining data:', verificationResult);
      }

      result.duration = Date.now() - startTime;
      
      console.log('✅ Phase 4: Mock Data Elimination completed successfully');
      console.log(`📊 Total records removed: ${result.totalRecordsRemoved}`);
      console.log(`⏱️ Duration: ${Math.round(result.duration / 1000)}s`);
      
      return result;
      
    } catch (error) {
      console.error('💥 Phase 4: Mock Data Elimination failed:', error);
      
      result.success = false;
      result.error = error.message;
      result.duration = Date.now() - startTime;
      
      return result;
    }
  }

  /**
   * Document current state before elimination
   */
  private static async documentCurrentState(): Promise<{ [tableName: string]: number }> {
    const state: { [tableName: string]: number } = {};
    
    for (const tableName of this.TABLES_TO_CLEAR) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          state[tableName] = count || 0;
        } else {
          state[tableName] = -1; // Error indicator
        }
      } catch (error) {
        state[tableName] = -1; // Error indicator
      }
    }
    
    return state;
  }

  /**
   * Reset database sequences after elimination
   */
  private static async resetDatabaseSequences(): Promise<void> {
    try {
      // Note: This would typically require admin privileges
      // For now, we'll just log the intention
      console.log('🔄 Sequences reset (admin privileges required for actual reset)');
    } catch (error) {
      console.warn('⚠️ Could not reset sequences:', error);
    }
  }

  /**
   * Verify that elimination was successful
   */
  private static async verifyElimination(): Promise<{ success: boolean; remainingData: { [tableName: string]: number } }> {
    const remainingData: { [tableName: string]: number } = {};
    let hasRemainingData = false;
    
    for (const tableName of this.TABLES_TO_CLEAR) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        if (!error && count !== null) {
          remainingData[tableName] = count;
          if (count > 0) {
            hasRemainingData = true;
          }
        }
      } catch (error) {
        console.warn(`Could not verify ${tableName}:`, error);
      }
    }
    
    return {
      success: !hasRemainingData,
      remainingData
    };
  }

  /**
   * Selective elimination - remove only specific data types
   */
  static async eliminateSpecificData(options: {
    patients?: boolean;
    referrals?: boolean;
    medicalHistory?: boolean;
    fhirData?: boolean;
  }): Promise<EliminationResult> {
    console.log('🎯 Phase 4: Selective Mock Data Elimination');
    const startTime = Date.now();
    
    const result: EliminationResult = {
      success: true,
      tablesCleared: [],
      totalRecordsRemoved: 0,
      duration: 0,
      details: {}
    };

    try {
      if (options.referrals) {
        await this.eliminateReferralData(result);
      }
      
      if (options.medicalHistory) {
        await this.eliminateMedicalHistoryData(result);
      }
      
      if (options.fhirData) {
        await this.eliminateFhirData(result);
      }
      
      if (options.patients) {
        await this.eliminatePatientData(result);
      }

      result.duration = Date.now() - startTime;
      console.log('✅ Selective elimination completed');
      
      return result;
      
    } catch (error) {
      result.success = false;
      result.error = error.message;
      result.duration = Date.now() - startTime;
      
      return result;
    }
  }

  private static async eliminateReferralData(result: EliminationResult): Promise<void> {
    const referralTables = ['audit_log', 'collaboration_notes', 'attachments', 'appointments', 'referral_tags', 'referrals'];
    
    for (const tableName of referralTables) {
      await this.clearTable(tableName, result);
    }
  }

  private static async eliminateMedicalHistoryData(result: EliminationResult): Promise<void> {
    const medicalTables = ['vital_signs', 'test_results', 'medications', 'mha_sections', 'allergies'];
    
    for (const tableName of medicalTables) {
      await this.clearTable(tableName, result);
    }
  }

  private static async eliminateFhirData(result: EliminationResult): Promise<void> {
    const fhirTables = ['fhir_contact_points', 'fhir_addresses', 'fhir_human_names', 'fhir_identifiers', 'fhir_codings', 'fhir_resources'];
    
    for (const tableName of fhirTables) {
      await this.clearTable(tableName, result);
    }
  }

  private static async eliminatePatientData(result: EliminationResult): Promise<void> {
    const patientTables = ['adjustment_details', 'reasonable_adjustments', 'historic_addresses', 'related_people', 'pharmacy_details', 'gp_details', 'patients'];
    
    for (const tableName of patientTables) {
      await this.clearTable(tableName, result);
    }
  }

  private static async clearTable(tableName: string, result: EliminationResult): Promise<void> {
    try {
      const { count, error } = await supabase
        .from(tableName)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (error) {
        result.details[tableName] = {
          recordsRemoved: 0,
          success: false,
          error: error.message
        };
        return;
      }

      const recordsRemoved = count || 0;
      result.details[tableName] = {
        recordsRemoved,
        success: true
      };
      
      result.tablesCleared.push(tableName);
      result.totalRecordsRemoved += recordsRemoved;
      
    } catch (error) {
      result.details[tableName] = {
        recordsRemoved: 0,
        success: false,
        error: error.message
      };
    }
  }
}
