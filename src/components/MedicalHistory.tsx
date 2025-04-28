
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Patient } from '@/types/referral';
import VitalSignsTab from './medical-history/VitalSignsTab';
import CardiogramView from './medical-history/CardiogramView';

interface MedicalHistoryProps {
  patient: Patient;
}

const MedicalHistory = ({ patient }: MedicalHistoryProps) => {
  if (!patient.medicalHistory) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No medical history available for this patient.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Medical History</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 overflow-hidden">
        <Tabs defaultValue="vitals" className="space-y-4">
          <TabsList>
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            <TabsTrigger value="cardiogram">Cardiogram Data</TabsTrigger>
          </TabsList>

          <TabsContent value="vitals" className="space-y-6">
            <VitalSignsTab vitalSigns={patient.medicalHistory.vitalSigns} />
          </TabsContent>

          <TabsContent value="cardiogram" className="space-y-6">
            <CardiogramView cardiograms={patient.medicalHistory.cardiograms || []} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MedicalHistory;
