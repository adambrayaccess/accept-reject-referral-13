
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { useState } from 'react';
import { Referral } from '@/types/referral';
import { usePatientJourney } from './patient-journey/hooks/usePatientJourney';
import JourneyHeader from './patient-journey/components/JourneyHeader';
import JourneyTimeline from './patient-journey/components/JourneyTimeline';

interface PatientJourneyProps {
  referral: Referral;
}

const PatientJourney = ({ referral }: PatientJourneyProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { journeyEvents } = usePatientJourney(referral);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <JourneyHeader specialty={referral.specialty} isOpen={isOpen} />
        
        <CollapsibleContent>
          <CardContent>
            <JourneyTimeline events={journeyEvents} />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default PatientJourney;
