import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import TriageHistorySheetContent from './TriageHistorySheetContent';

interface TriageHistorySheetProps {
  referralId: string;
  auditLog: any[];  // Using any[] to match the current audit log type
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const TriageHistorySheet = ({ 
  referralId, 
  auditLog, 
  isOpen, 
  onOpenChange 
}: TriageHistorySheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl lg:max-w-4xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl">Triage History & Clinical Notes</SheetTitle>
          <SheetDescription className="text-base">
            Complete audit trail of referral status changes, triage decisions, and clinical notes
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="pr-4">
            <TriageHistorySheetContent 
              referralId={referralId}
              auditLog={auditLog}
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default TriageHistorySheet;