import { useState, useEffect } from 'react';
import { getInpatientAdmissionsByPatientId, type InpatientAdmission } from '@/services/inpatientService';
import InpatientHistoryButton from './InpatientHistoryButton';
import InpatientHistorySheet from './InpatientHistorySheet';

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
      <InpatientHistoryButton
        onClick={() => setIsSheetOpen(true)}
        admissionCount={admissions.length}
      />
      
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