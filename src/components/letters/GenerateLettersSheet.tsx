import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import GenerateLettersSheetContent from './GenerateLettersSheetContent';

interface GenerateLettersSheetProps {
  referralId: string;
  patientName?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLetterCreated?: () => void;
}

const GenerateLettersSheet = ({ 
  referralId, 
  patientName, 
  isOpen, 
  onOpenChange,
  onLetterCreated
}: GenerateLettersSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl lg:max-w-4xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl">Generate Letters</SheetTitle>
          <SheetDescription className="text-base">
            Create and send communication letters{patientName ? ` for ${patientName}` : ''}
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="pr-4">
            <GenerateLettersSheetContent 
              referralId={referralId} 
              onLetterCreated={onLetterCreated}
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default GenerateLettersSheet;