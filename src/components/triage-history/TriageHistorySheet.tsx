import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History } from 'lucide-react';
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
          <SheetTitle className="text-2xl flex items-center gap-2">
            <History className="h-6 w-6" />
            Triage History & Clinical Notes
          </SheetTitle>
          <SheetDescription className="text-base">
            Complete audit trail of referral status changes, triage decisions, and clinical notes
          </SheetDescription>
        </SheetHeader>
        
        <div className="h-[calc(100vh-180px)]">
          <TriageHistorySheetContent 
            referralId={referralId}
            auditLog={auditLog}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TriageHistorySheet;