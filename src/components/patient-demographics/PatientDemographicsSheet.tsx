
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import PatientDemographicsSheetContent from './PatientDemographicsSheetContent';

interface PatientDemographicsSheetProps {
  patientId: string;
  patientName?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const PatientDemographicsSheet = ({ 
  patientId, 
  patientName, 
  isOpen, 
  onOpenChange 
}: PatientDemographicsSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl lg:max-w-4xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl">Patient Case Record</SheetTitle>
          <SheetDescription className="text-base">
            Comprehensive demographic and clinical information{patientName ? ` for ${patientName}` : ''}
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="pr-4">
            <PatientDemographicsSheetContent patientId={patientId} />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default PatientDemographicsSheet;
