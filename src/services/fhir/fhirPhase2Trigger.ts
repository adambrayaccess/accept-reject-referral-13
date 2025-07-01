
import { FhirDataPopulationService, PopulationStats } from './fhirDataPopulationService';

export class FhirPhase2Trigger {
  /**
   * Execute Phase 2 of FHIR compliance - Data Mapping and Population
   */
  static async executePhase2(): Promise<PopulationStats> {
    console.log('🚀 Executing FHIR Compliance Phase 2: Data Mapping and Population');
    
    try {
      // Execute comprehensive data population
      const stats = await FhirDataPopulationService.populateAllData();
      
      console.log('✅ Phase 2 Complete!');
      console.log('📊 Population Statistics:');
      console.log(`   Total Records Processed: ${stats.totalProcessed}`);
      console.log(`   Successful Conversions: ${stats.totalSuccessful}`);
      console.log(`   Failed Conversions: ${stats.totalFailed}`);
      console.log(`   Success Rate: ${stats.totalProcessed > 0 ? Math.round((stats.totalSuccessful / stats.totalProcessed) * 100) : 0}%`);
      
      return stats;
    } catch (error) {
      console.error('❌ Phase 2 Execution Failed:', error);
      throw error;
    }
  }

  /**
   * Get current population status
   */
  static async getPopulationStatus(): Promise<{
    isComplete: boolean;
    percentage: number;
    details: any;
  }> {
    try {
      const statistics = await FhirDataPopulationService.getPopulationStatistics();
      
      return {
        isComplete: statistics.populationPercentage >= 95, // Consider 95% as complete
        percentage: statistics.populationPercentage,
        details: statistics
      };
    } catch (error) {
      console.error('Error getting population status:', error);
      return {
        isComplete: false,
        percentage: 0,
        details: null
      };
    }
  }
}
