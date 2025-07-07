import { Button } from '@/components/ui/button';
import { BedDouble } from 'lucide-react';

interface InpatientHistoryButtonProps {
  onClick: () => void;
  admissionCount?: number;
}

const InpatientHistoryButton = ({ onClick, admissionCount }: InpatientHistoryButtonProps) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="w-full justify-start gap-2"
    >
      <BedDouble className="h-4 w-4" />
      <span>View Inpatient History</span>
      {admissionCount !== undefined && admissionCount > 0 && (
        <span className="ml-auto text-xs text-muted-foreground">
          {admissionCount} admission{admissionCount !== 1 ? 's' : ''}
        </span>
      )}
    </Button>
  );
};

export default InpatientHistoryButton;