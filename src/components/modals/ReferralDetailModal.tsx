
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Referral } from '@/types/referral';
import { fetchReferralById, fetchPatientReferrals } from '@/services/referralService';
import { useToast } from '@/hooks/use-toast';
import ReferralDetail from '@/components/ReferralDetail';
import MedicalHistory from '@/components/MedicalHistory';
import AttachmentViewer from '@/components/AttachmentViewer';
import { Skeleton } from '@/components/ui/skeleton';

interface ReferralDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralId: string | null;
}

const ReferralDetailModal = ({ isOpen, onClose, referralId }: ReferralDetailModalProps) => {
  const [referral, setReferral] = useState<Referral | null>(null);
  const [relatedReferrals, setRelatedReferrals] = useState<{
    serviceTotal: number;
    activeTotal: number;
    activeSpecialties: string[];
  }>({ 
    serviceTotal: 0, 
    activeTotal: 0,
    activeSpecialties: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadReferral = async () => {
    if (!referralId) return;
    
    setIsLoading(true);
    try {
      const data = await fetchReferralById(referralId);
      
      if (!data) {
        toast({
          title: 'Error',
          description: 'Referral not found',
          variant: 'destructive',
        });
        onClose();
        return;
      }
      
      setReferral(data);
      
      const patientReferrals = await fetchPatientReferrals(data.patient.id);
      const serviceReferrals = patientReferrals.filter(ref => ref.specialty === data.specialty && ref.id !== data.id);
      const activeReferrals = patientReferrals.filter(ref => ref.status !== 'rejected' && ref.id !== data.id);
      const activeSpecialties = Array.from(new Set(activeReferrals.map(ref => ref.specialty)));
      
      setRelatedReferrals({
        serviceTotal: serviceReferrals.length,
        activeTotal: activeReferrals.length,
        activeSpecialties
      });
    } catch (error) {
      console.error('Error fetching referral:', error);
      toast({
        title: 'Error',
        description: 'Failed to load referral details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && referralId) {
      loadReferral();
    }
  }, [isOpen, referralId]);

  const handleClose = () => {
    setReferral(null);
    setRelatedReferrals({ serviceTotal: 0, activeTotal: 0, activeSpecialties: [] });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>
            {referral ? `${referral.patient.name} - Referral Details` : 'Referral Details'}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-6 pb-6">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="w-full h-[400px] rounded-lg" />
              <Skeleton className="w-full h-[300px] rounded-lg" />
              <Skeleton className="w-full h-[200px] rounded-lg" />
            </div>
          ) : referral ? (
            <div className="space-y-6">
              <ReferralDetail 
                referral={referral} 
                relatedReferrals={relatedReferrals}
              />
              <MedicalHistory patient={referral.patient} />
              <AttachmentViewer attachments={referral.attachments} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-semibold mb-2">No referral selected</h3>
              <p className="text-muted-foreground">Please select a referral to view details.</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ReferralDetailModal;
