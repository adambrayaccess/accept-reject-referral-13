
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedTabs, EnhancedTabsContent, EnhancedTabsList, EnhancedTabsTrigger } from '@/components/ui/enhanced-tabs';
import { Patient } from '@/types/patient';
import AllergiesTab from './medical-history/AllergiesTab';
import VitalSignsTab from './medical-history/VitalSignsTab';
import TestResultsTab from './medical-history/TestResultsTab';
import MedicationHistoryTab from './medical-history/MedicationHistoryTab';
import MHATab from './medical-history/MHATab';

interface MedicalHistoryProps {
  patient: Patient;
}

const MedicalHistory = ({ patient }: MedicalHistoryProps) => {
  if (!patient.medicalHistory) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Medical History</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm">No medical history available for this patient.</p>
        </CardContent>
      </Card>
    );
  }

  const tabCount = 5; // Allergies, Vital Signs, Test Results, Medication History, MHA

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Medical History</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 overflow-hidden">
        <EnhancedTabs defaultValue="allergies" className="space-y-3">
          <div className="mb-3">
            <EnhancedTabsList variant="grid" size="md" enableDynamicSizing={true}>
              <EnhancedTabsTrigger 
                value="allergies" 
                variant="grid" 
                size="md"
                enableDynamicSizing={true}
                tabCount={tabCount}
              >
                Allergies
              </EnhancedTabsTrigger>
              <EnhancedTabsTrigger 
                value="vitals" 
                variant="grid" 
                size="md"
                enableDynamicSizing={true}
                tabCount={tabCount}
              >
                Vital Signs
              </EnhancedTabsTrigger>
              <EnhancedTabsTrigger 
                value="test-results" 
                variant="grid" 
                size="md"
                enableDynamicSizing={true}
                tabCount={tabCount}
              >
                Test Results
              </EnhancedTabsTrigger>
              <EnhancedTabsTrigger 
                value="medications" 
                variant="grid" 
                size="md"
                enableDynamicSizing={true}
                tabCount={tabCount}
              >
                Medication History
              </EnhancedTabsTrigger>
              <EnhancedTabsTrigger 
                value="mha" 
                variant="grid" 
                size="md"
                enableDynamicSizing={true}
                tabCount={tabCount}
              >
                MHA
              </EnhancedTabsTrigger>
            </EnhancedTabsList>
          </div>

          <EnhancedTabsContent value="allergies">
            <AllergiesTab allergies={patient.medicalHistory.allergies} />
          </EnhancedTabsContent>

          <EnhancedTabsContent value="vitals">
            <VitalSignsTab vitalSigns={patient.medicalHistory.vitalSigns} />
          </EnhancedTabsContent>

          <EnhancedTabsContent value="test-results">
            <TestResultsTab testResults={patient.medicalHistory.testResults} />
          </EnhancedTabsContent>

          <EnhancedTabsContent value="medications">
            <MedicationHistoryTab medicationHistory={patient.medicalHistory.medicationHistory} />
          </EnhancedTabsContent>

          <EnhancedTabsContent value="mha">
            <MHATab mhaSections={patient.medicalHistory.mhaSections} />
          </EnhancedTabsContent>
        </EnhancedTabs>
      </CardContent>
    </Card>
  );
};

export default MedicalHistory;
