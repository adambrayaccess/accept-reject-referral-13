
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
      className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
    >
      <User className="h-4 w-4" />
      View Demographics
      <ExternalLink className="h-3 w-3" />
    </Button>
  );
};

export default PatientDemographicsButton;
