import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getInpatientAdmissionsByPatientId, type InpatientAdmission } from '@/services/inpatientService';
import InpatientHistoryButton from './InpatientHistoryButton';
import InpatientHistorySheet from './InpatientHistorySheet';
import { BedDouble } from 'lucide-react';

interface InpatientHistoryProps {
  patientId: string;
  patientName?: string;
  refreshTrigger?: number;
}

const InpatientHistory = ({ patientId, patientName, refreshTrigger }: InpatientHistoryProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [admissions, setAdmissions] = useState<InpatientAdmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdmissions = async () => {
      setIsLoading(true);
      try {
        const data = await getInpatientAdmissionsByPatientId(patientId);
        setAdmissions(data);
      } catch (error) {
        console.error('Error fetching inpatient admissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmissions();
  }, [patientId, refreshTrigger]);

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BedDouble className="h-5 w-5" />
              Inpatient History
            </CardTitle>
            <InpatientHistoryButton
              onClick={() => setIsSheetOpen(true)}
              admissionCount={admissions.length}
            />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Click "View Inpatient History" to see complete admission and discharge records
          </p>
        </CardContent>
      </Card>
      
      <InpatientHistorySheet
        patientId={patientId}
        patientName={patientName}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        refreshTrigger={refreshTrigger}
      />
    </>
  );
};

export default InpatientHistory;