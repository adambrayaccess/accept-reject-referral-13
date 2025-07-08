import { useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Referral } from '@/types/referral';
import CreateReferralHeader from './CreateReferralHeader';
import CreateReferralForm from './CreateReferralForm';
import CreateReferralFooter from './CreateReferralFooter';

interface CreateReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (referral: Partial<Referral>) => void;
}

const CreateReferralModal = ({ isOpen, onClose, onSubmit }: CreateReferralModalProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingPatient, setIsCreatingPatient] = useState(false);
  const [formSubmitHandler, setFormSubmitHandler] = useState<(() => void) | null>(null);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-3xl lg:max-w-4xl">
        <CreateReferralHeader />
        
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto">
            <CreateReferralForm
              onSubmit={onSubmit}
              onClose={onClose}
              isCreating={isCreating}
              setIsCreating={setIsCreating}
              isCreatingPatient={isCreatingPatient}
              setIsCreatingPatient={setIsCreatingPatient}
              onFormSubmitReady={setFormSubmitHandler}
            />
          </div>
          
          <CreateReferralFooter
            onCancel={onClose}
            onSubmit={() => formSubmitHandler?.()}
            isCreating={isCreating}
            isCreatingPatient={isCreatingPatient}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateReferralModal;