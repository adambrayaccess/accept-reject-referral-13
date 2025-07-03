import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import AddClinicalNoteSheetContent from './AddClinicalNoteSheetContent';

interface AddClinicalNoteSheetProps {
  referralId: string;
  patientName?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNoteCreated?: () => void;
}

const AddClinicalNoteSheet = ({ 
  referralId, 
  patientName, 
  isOpen, 
  onOpenChange,
  onNoteCreated
}: AddClinicalNoteSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl lg:max-w-4xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl">Add Clinical Note</SheetTitle>
          <SheetDescription className="text-base">
            Add a clinical note to the referral{patientName ? ` for ${patientName}` : ''}
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="pr-4">
            <AddClinicalNoteSheetContent 
              referralId={referralId} 
              onNoteCreated={onNoteCreated}
              onClose={() => onOpenChange(false)}
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default AddClinicalNoteSheet;