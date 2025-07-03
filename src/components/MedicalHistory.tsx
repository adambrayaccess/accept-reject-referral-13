
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedTabs, EnhancedTabsContent, EnhancedTabsList, EnhancedTabsTrigger } from '@/components/ui/enhanced-tabs';
import { Patient } from '@/types/patient';
import VitalSignsTab from './medical-history/VitalSignsTab';
import TestResultsTab from './medical-history/TestResultsTab';
import MedicationHistoryTab from './medical-history/MedicationHistoryTab';
import MHATab from './medical-history/MHATab';

interface MedicalHistoryProps {
  patient: Patient;
}

const MedicalHistory = ({ patient }: MedicalHistoryProps) => {
  console.log('🔍 MedicalHistory Debug:', {
    patientId: patient.id,
    patientName: patient.name,
    hasMedicalHistory: !!patient.medicalHistory,
    vitalSigns: patient.medicalHistory?.vitalSigns?.length || 0,
    medicationHistory: patient.medicalHistory?.medicationHistory?.length || 0,
    testResults: patient.medicalHistory?.testResults?.length || 0,
    mhaSections: patient.medicalHistory?.mhaSections?.length || 0,
    allergies: patient.medicalHistory?.allergies?.length || 0,
    fullMedicalHistory: patient.medicalHistory
  });

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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Medical History</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 overflow-hidden">
        <EnhancedTabs defaultValue="vitals" className="space-y-3">
          <div className="mb-3">
            <EnhancedTabsList variant="grid" size="md">
              <EnhancedTabsTrigger value="vitals" variant="grid" size="md">
                Vital Signs
              </EnhancedTabsTrigger>
              <EnhancedTabsTrigger value="test-results" variant="grid" size="md">
                Test Results
              </EnhancedTabsTrigger>
              <EnhancedTabsTrigger value="medications" variant="grid" size="md">
                Medication History
              </EnhancedTabsTrigger>
              <EnhancedTabsTrigger value="mha" variant="grid" size="md">
                MHA
              </EnhancedTabsTrigger>
            </EnhancedTabsList>
          </div>

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
