
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

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
      View Case Record
    </Button>
  );
};

export default PatientDemographicsButton;
