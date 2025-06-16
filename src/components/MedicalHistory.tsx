
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
        <Tabs defaultValue="vitals" className="space-y-3">
          <TabsList className="h-8">
            <TabsTrigger value="vitals" className="text-xs">Vital Signs</TabsTrigger>
            <TabsTrigger value="cardiogram" className="text-xs">Cardiogram Data</TabsTrigger>
          </TabsList>

          <TabsContent value="vitals" className="mt-0">
            <VitalSignsTab vitalSigns={patient.medicalHistory.vitalSigns} />
          </TabsContent>

          <TabsContent value="cardiogram" className="mt-0">
            <CardiogramView cardiograms={patient.medicalHistory.cardiograms || []} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MedicalHistory;
