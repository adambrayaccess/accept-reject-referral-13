
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedTabs, EnhancedTabsContent, EnhancedTabsList, EnhancedTabsTrigger } from '@/components/ui/enhanced-tabs';
import { Patient } from '@/types/referral';
import VitalSignsTab from './medical-history/VitalSignsTab';
import CardiogramView from './medical-history/CardiogramView';
import MedicationHistoryTab from './medical-history/MedicationHistoryTab';

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
              <EnhancedTabsTrigger value="cardiogram" variant="grid" size="md">
                Cardiogram Data
              </EnhancedTabsTrigger>
              <EnhancedTabsTrigger value="medications" variant="grid" size="md">
                Medication History
              </EnhancedTabsTrigger>
            </EnhancedTabsList>
          </div>

          <EnhancedTabsContent value="vitals">
            <VitalSignsTab vitalSigns={patient.medicalHistory.vitalSigns} />
          </EnhancedTabsContent>

          <EnhancedTabsContent value="cardiogram">
            <CardiogramView cardiograms={patient.medicalHistory.cardiograms || []} />
          </EnhancedTabsContent>

          <EnhancedTabsContent value="medications">
            <MedicationHistoryTab medicationHistory={patient.medicalHistory.medicationHistory} />
          </EnhancedTabsContent>
        </EnhancedTabs>
      </CardContent>
    </Card>
  );
};

export default MedicalHistory;
