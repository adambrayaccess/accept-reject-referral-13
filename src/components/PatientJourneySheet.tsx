import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Route } from 'lucide-react';
import { Referral } from '@/types/referral';
import PatientJourneySheetContent from './PatientJourneySheetContent';

interface PatientJourneySheetProps {
  referral: Referral;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const PatientJourneySheet = ({ referral, isOpen, onOpenChange }: PatientJourneySheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl lg:max-w-4xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <Route className="h-6 w-6" />
            Patient Journey
          </SheetTitle>
          <SheetDescription className="text-base">
            Comprehensive patient journey timeline for {referral.patient.name}
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="pr-4">
            <PatientJourneySheetContent referral={referral} />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default PatientJourneySheet;