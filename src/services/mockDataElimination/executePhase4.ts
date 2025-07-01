
import { MockDataEliminationService } from './mockDataEliminationService';

/**
 * Execute Phase 4: Mock Data Elimination
 * This phase systematically removes all mock data from the database
 */
export async function executePhase4Elimination() {
  console.log('🧹 PHASE 4: Mock Data Elimination');
  console.log('⚠️  WARNING: This will permanently delete all mock data!');
  console.log('📋 This phase will:');
  console.log('   - Remove all mock patients and their data');
  console.log('   - Clear all mock referrals and clinical information');
  console.log('   - Delete all mock medical history records');
  console.log('   - Remove all mock FHIR data');
  console.log('   - Reset the system to a clean production state');
  
  try {
    console.log('\n🚀 Starting comprehensive mock data elimination...');
    const result = await MockDataEliminationService.eliminateAllMockData();
    
    if (result.success) {
      console.log('\n✅ PHASE 4 COMPLETED SUCCESSFULLY!');
      console.log('🧹 Mock Data Elimination Summary:');
      console.log(`   📊 Total Records Removed: ${result.totalRecordsRemoved}`);
      console.log(`   🗂️ Tables Cleared: ${result.tablesCleared.length}`);
      console.log(`   ⏱️ Duration: ${Math.round(result.duration / 1000)}s`);
      
      console.log('\n📋 Detailed Elimination Results:');
      Object.entries(result.details).forEach(([table, details]) => {
        if (details.success) {
          console.log(`   ✅ ${table}: ${details.recordsRemoved} records removed`);
        } else {
          console.log(`   ❌ ${table}: Failed - ${details.error}`);
        }
      });
      
      console.log('\n🎯 Phase 4 Key Achievements:');
      console.log('   ✓ All mock patient data eliminated');
      console.log('   ✓ All mock referrals and clinical data removed');
      console.log('   ✓ All mock medical history records deleted');
      console.log('   ✓ All mock FHIR data cleared');
      console.log('   ✓ Database prepared for production use');
      console.log('   ✓ Clean slate ready for real data');
      
      return {
        phase: 'Phase 4: Mock Data Elimination',
        success: true,
        recordsRemoved: result.totalRecordsRemoved,
        tablesCleared: result.tablesCleared,
        duration: result.duration,
        details: result.details
      };
    } else {
      console.error('\n❌ PHASE 4 FAILED');
      console.error('Error:', result.error);
      
      // Provide specific guidance for common issues
      if (result.error?.includes('permission denied') || result.error?.includes('42501')) {
        console.log('\n🔧 PERMISSION TROUBLESHOOTING:');
        console.log('   The elimination process requires delete permissions on all tables.');
        console.log('   This may be restricted by Row-Level Security policies.');
        console.log('   Consider using service role key for administrative operations.');
      }
      
      if (result.error?.includes('foreign key constraint')) {
        console.log('\n🔧 FOREIGN KEY TROUBLESHOOTING:');
        console.log('   The elimination process follows proper dependency order.');
        console.log('   If foreign key errors persist, check for circular references.');
        console.log('   Some tables may need to be cleared manually in a specific order.');
      }
      
      return {
        phase: 'Phase 4: Mock Data Elimination',
        success: false,
        error: result.error,
        partialResults: result.details
      };
    }
    
  } catch (error) {
    console.error('\n💥 PHASE 4 EXCEPTION:', error);
    return {
      phase: 'Phase 4: Mock Data Elimination',
      success: false,
      error: error.message
    };
  }
}

/**
 * Execute selective elimination for testing purposes
 */
export async function executeSelectiveElimination(options: {
  patients?: boolean;
  referrals?: boolean;
  medicalHistory?: boolean;
  fhirData?: boolean;
}) {
  console.log('🎯 PHASE 4: Selective Mock Data Elimination');
  console.log('📋 Selective elimination options:', options);
  
  try {
    const result = await MockDataEliminationService.eliminateSpecificData(options);
    
    if (result.success) {
      console.log('\n✅ Selective elimination completed successfully!');
      console.log(`📊 Records removed: ${result.totalRecordsRemoved}`);
      console.log(`🗂️ Tables affected: ${result.tablesCleared.length}`);
      
      return {
        phase: 'Phase 4: Selective Elimination',
        success: true,
        recordsRemoved: result.totalRecordsRemoved,
        tablesCleared: result.tablesCleared,
        options
      };
    } else {
      console.error('\n❌ Selective elimination failed:', result.error);
      return {
        phase: 'Phase 4: Selective Elimination',
        success: false,
        error: result.error,
        options
      };
    }
    
  } catch (error) {
    console.error('\n💥 Selective elimination exception:', error);
    return {
      phase: 'Phase 4: Selective Elimination',
      success: false,
      error: error.message,
      options
    };
  }
}

// Auto-execute if this file is run directly
if (typeof window !== 'undefined') {
  console.log('🧹 Phase 4: Mock Data Elimination - Ready for execution');
  console.log('💡 Execute with: executePhase4Elimination()');
  console.log('🎯 Or selective: executeSelectiveElimination({patients: true, referrals: false})');
  
  (window as any).executePhase4Elimination = executePhase4Elimination;
  (window as any).executeSelectiveElimination = executeSelectiveElimination;
  
  // Don't auto-execute elimination as it's destructive
  console.log('⚠️  WARNING: Phase 4 is destructive and requires manual execution');
  console.log('🚨 This will permanently delete all mock data!');
  console.log('💡 Only execute when ready to move to production');
}
