
import { Button } from '@/components/ui/button';
import { User, ExternalLink } from 'lucide-react';

interface PatientDemographicsButtonProps {
  onClick: () => void;
}

const PatientDemographicsButton = ({ onClick }: PatientDemographicsButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all duration-200 font-medium"
    >
      <User className="h-4 w-4" />
      View Full Demographics
      <ExternalLink className="h-3 w-3" />
    </Button>
  );
};

export default PatientDemographicsButton;
