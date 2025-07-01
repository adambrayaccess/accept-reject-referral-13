
import { FhirResourceGenerationService } from './fhirResourceGenerationService';

/**
 * Phase 4 Trigger: FHIR Resource Generation
 * 
 * This service provides easy-to-use methods to trigger Phase 4 FHIR resource generation.
 * It can be called from the admin interface or run as a background process.
 */
export class FhirPhase4Trigger {
  /**
   * Execute Phase 4: Complete FHIR Resource Generation
   */
  static async executePhase4(): Promise<void> {
    console.log('🚀 Starting Phase 4: FHIR Resource Generation');
    console.log('This will generate FHIR resources for all existing referrals...');
    
    try {
      const startTime = Date.now();
      
      // Execute the main FHIR resource generation
      const result = await FhirResourceGenerationService.generateAllFhirResources();
      
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      console.log('\n🎉 Phase 4 Execution Complete!');
      console.log(`⏱️  Total execution time: ${duration} seconds`);
      console.log(`📊 Results Summary:`);
      console.log(`   • Total processed: ${result.totalProcessed}`);
      console.log(`   • Successfully generated: ${result.successful.length}`);
      console.log(`   • Failed: ${result.failed.length}`);
      console.log(`   • Validation warnings: ${Object.keys(result.validationErrors).length}`);
      
      if (result.failed.length > 0) {
        console.warn('⚠️  Some referrals failed to generate FHIR resources:');
        result.failed.forEach(id => console.warn(`   - ${id}`));
      }
      
      console.log('\n✅ Phase 4: FHIR Resource Generation completed successfully!');
      
    } catch (error) {
      console.error('❌ Phase 4 execution failed:', error);
      throw error;
    }
  }

  /**
   * Get current FHIR generation status
   */
  static async getGenerationStatus(): Promise<void> {
    console.log('📊 FHIR Resource Generation Status:');
    
    try {
      const stats = await FhirResourceGenerationService.getFhirGenerationStatistics();
      
      console.log(`   • Total FHIR resources: ${stats.totalFhirResources}`);
      console.log(`   • Patient resources: ${stats.patientResources}`);
      console.log(`   • Practitioner resources: ${stats.practitionerResources}`);
      console.log(`   • ServiceRequest resources: ${stats.serviceRequestResources}`);
      console.log(`   • Last generated: ${stats.lastGenerated || 'Never'}`);
      
    } catch (error) {
      console.error('Error getting generation status:', error);
    }
  }

  /**
   * Quick execution method for testing (can be called from browser console)
   */
  static async quickExecute(): Promise<void> {
    console.log('🔧 Quick Phase 4 execution started...');
    
    // Show current status first
    await this.getGenerationStatus();
    
    // Execute Phase 4
    await this.executePhase4();
    
    // Show final status
    console.log('\n📊 Final Status:');
    await this.getGenerationStatus();
  }
}

// Make it available globally for easy console access
if (typeof window !== 'undefined') {
  (window as any).FhirPhase4 = FhirPhase4Trigger;
  console.log('💡 FhirPhase4 is now available in the browser console!');
  console.log('   Run: FhirPhase4.quickExecute() to start Phase 4');
  console.log('   Run: FhirPhase4.getGenerationStatus() to check current status');
}
