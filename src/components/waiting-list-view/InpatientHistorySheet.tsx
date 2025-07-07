import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BedDouble } from 'lucide-react';
import InpatientHistorySheetContent from './InpatientHistorySheetContent';

interface InpatientHistorySheetProps {
  patientId: string;
  patientName?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  refreshTrigger?: number;
}

const InpatientHistorySheet = ({ 
  patientId, 
  patientName, 
  isOpen, 
  onOpenChange,
  refreshTrigger
}: InpatientHistorySheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl lg:max-w-4xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <BedDouble className="h-6 w-6" />
            Inpatient History
          </SheetTitle>
          <SheetDescription className="text-base">
            Complete admission and discharge history{patientName ? ` for ${patientName}` : ''}
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="pr-4">
            <InpatientHistorySheetContent 
              patientId={patientId} 
              refreshTrigger={refreshTrigger} 
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default InpatientHistorySheet;