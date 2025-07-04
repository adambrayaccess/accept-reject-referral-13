import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { BedDouble } from 'lucide-react';
import { getInpatientAdmissionsByPatientId, type InpatientAdmission } from '@/services/inpatientService';

interface InpatientStatusBadgeProps {
  patientId: string;
}

const InpatientStatusBadge = ({ patientId }: InpatientStatusBadgeProps) => {
  const [hasActiveAdmission, setHasActiveAdmission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkActiveAdmission = async () => {
      setIsLoading(true);
      try {
        const admissions = await getInpatientAdmissionsByPatientId(patientId);
        const activeAdmission = admissions.find(
          (admission: InpatientAdmission) => admission.current_status === 'Active'
        );
        setHasActiveAdmission(!!activeAdmission);
      } catch (error) {
        console.error('Error checking inpatient status:', error);
        setHasActiveAdmission(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkActiveAdmission();
  }, [patientId]);

  if (isLoading || !hasActiveAdmission) {
    return null;
  }

  return (
    <Badge 
      variant="secondary" 
      className="bg-purple text-purple-foreground hover:bg-purple/90 flex items-center gap-1"
    >
      <BedDouble className="h-3 w-3" />
      Admitted
    </Badge>
  );
};

export default InpatientStatusBadge;