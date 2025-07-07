import { Button } from '@/components/ui/button';
import { BedDouble, ExternalLink } from 'lucide-react';

interface InpatientHistoryButtonProps {
  onClick: () => void;
  admissionCount?: number;
}

const InpatientHistoryButton = ({ onClick, admissionCount }: InpatientHistoryButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all duration-200 font-medium"
    >
      <BedDouble className="h-4 w-4" />
      View Inpatient History
      {admissionCount !== undefined && admissionCount > 0 && (
        <span className="text-xs text-muted-foreground">
          ({admissionCount})
        </span>
      )}
      <ExternalLink className="h-3 w-3" />
    </Button>
  );
};

export default InpatientHistoryButton;