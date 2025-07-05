import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { FileText } from 'lucide-react';

const CreateReferralHeader = () => {
  return (
    <SheetHeader className="pb-4">
      <SheetTitle className="text-2xl flex items-center gap-2">
        <FileText className="h-6 w-6" />
        Create Referral
      </SheetTitle>
    </SheetHeader>
  );
};

export default CreateReferralHeader;