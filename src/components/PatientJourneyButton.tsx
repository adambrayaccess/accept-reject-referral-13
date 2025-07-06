import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Route } from 'lucide-react';
import { Referral } from '@/types/referral';
import PatientJourneySheet from './PatientJourneySheet';

interface PatientJourneyButtonProps {
  referral: Referral;
}

const PatientJourneyButton = ({ referral }: PatientJourneyButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-accent text-secondary-foreground border-secondary"
      >
        <Route className="h-4 w-4" />
        View Patient Journey
      </Button>
      
      <PatientJourneySheet
        referral={referral}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
};

export default PatientJourneyButton;