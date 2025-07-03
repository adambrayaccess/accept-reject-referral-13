import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import RioReferralSheetContent from './RioReferralSheetContent';

interface RioReferralSheetProps {
  referralId: string;
  referrerName?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const RioReferralSheet = ({ 
  referralId, 
  referrerName, 
  isOpen, 
  onOpenChange 
}: RioReferralSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl lg:max-w-4xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl">Rio Referral Details</SheetTitle>
          <SheetDescription className="text-base">
            Comprehensive referral information{referrerName ? ` from ${referrerName}` : ''}
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="pr-4">
            <RioReferralSheetContent referralId={referralId} />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default RioReferralSheet;