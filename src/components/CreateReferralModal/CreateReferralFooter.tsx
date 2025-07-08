import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface CreateReferralFooterProps {
  onCancel: () => void;
  onSubmit: () => void;
  isCreating: boolean;
  isCreatingPatient: boolean;
}

const CreateReferralFooter = ({ 
  onCancel, 
  onSubmit, 
  isCreating, 
  isCreatingPatient 
}: CreateReferralFooterProps) => {
  return (
    <div className="border-t bg-background p-4 pb-8">
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={isCreating || isCreatingPatient}
        >
          Cancel
        </Button>
        <Button 
          onClick={onSubmit} 
          disabled={isCreating || isCreatingPatient}
        >
          {isCreating || isCreatingPatient ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {isCreatingPatient ? 'Creating Patient...' : 'Creating Referral...'}
            </>
          ) : (
            'Create Referral'
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreateReferralFooter;