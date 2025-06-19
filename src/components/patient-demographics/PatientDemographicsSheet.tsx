
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Patient } from '@/types/patient';
import PatientDemographicsContent from './PatientDemographicsContent';

interface PatientDemographicsSheetProps {
  patient: Patient;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const PatientDemographicsSheet = ({ patient, isOpen, onOpenChange }: PatientDemographicsSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl lg:max-w-4xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl">Patient Demographics</SheetTitle>
          <SheetDescription className="text-base">
            Comprehensive demographic and clinical information for {patient.name}
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="pr-4">
            <PatientDemographicsContent patient={patient} />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default PatientDemographicsSheet;
