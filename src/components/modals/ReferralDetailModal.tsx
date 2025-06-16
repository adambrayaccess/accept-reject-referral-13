import { useState, useEffect } from 'react';
import { Referral } from '@/types/referral';
import { fetchReferralById, fetchPatientReferrals } from '@/services/referralService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import AppointmentStatus from '@/components/AppointmentStatus';
import ReferralPriorityBadge from '@/components/dashboard/ReferralPriorityBadge';

interface ReferralDetailModalProps {
  referralId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReferralDetailModal = ({ referralId, isOpen, onClose }: ReferralDetailModalProps) => {
  const [referral, setReferral] = useState<Referral | null>(null);
  const [relatedReferrals, setRelatedReferrals] = useState<{
    serviceTotal: number;
    activeTotal: number;
    activeSpecialties: string[];
  }>({ serviceTotal: 0, activeTotal: 0, activeSpecialties: [] });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (referralId && isOpen) {
      loadReferral();
    }
  }, [referralId, isOpen]);

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="w-full h-[200px]" />
            <Skeleton className="w-full h-[150px]" />
          </div>
        ) : referral ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <div className="flex items-center gap-2">
                <ReferralPriorityBadge priority={referral.priority} />
                <Badge variant="outline">
                  {`Ref: ${referral.id}`}
                </Badge>
                <Badge variant="outline" className="font-mono">
                  {`UBRN: ${referral.ubrn}`}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <div className="info-label">Full Name</div>
                <div className="info-value">{referral.patient.name}</div>
              </div>
              
              <div>
                <div className="info-label">NHS Number</div>
                <div className="info-value font-mono">{referral.patient.nhsNumber}</div>
              </div>
              
              <div>
                <div className="info-label">Date of Birth</div>
                <div className="info-value">
                  {format(new Date(referral.patient.birthDate), 'dd MMM yyyy')}
                  {' '}
                  ({new Date().getFullYear() - new Date(referral.patient.birthDate).getFullYear()} years)
                </div>
              </div>
              
              <div>
                <div className="info-label">Gender</div>
                <div className="info-value">{referral.patient.gender.charAt(0).toUpperCase() + referral.patient.gender.slice(1)}</div>
              </div>
              
              {referral.patient.address && (
                <div className="col-span-1 md:col-span-2">
                  <div className="info-label">Address</div>
                  <div className="info-value">{referral.patient.address}</div>
                </div>
              )}
              
              {referral.patient.phone && (
                <div>
                  <div className="info-label">Contact Number</div>
                  <div className="info-value">{referral.patient.phone}</div>
                </div>
              )}
              
              <div className="col-span-1 md:col-span-2">
                <div className="flex flex-col gap-4 p-3 bg-muted rounded-lg mt-2">
                  <div className="flex gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Other referrals to {referral.specialty}</div>
                      <div className="text-2xl font-bold">{relatedReferrals.serviceTotal}</div>
                    </div>
                    <Separator orientation="vertical" className="h-auto" />
                    <div>
                      <div className="text-sm text-muted-foreground">Active referrals</div>
                      <div className="text-2xl font-bold">{relatedReferrals.activeTotal}</div>
                    </div>
                  </div>
                  {relatedReferrals.activeSpecialties && relatedReferrals.activeSpecialties.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Active referral specialties:</div>
                        <div className="flex flex-wrap gap-2">
                          {relatedReferrals.activeSpecialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary">{specialty}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Appointment Status Section */}
            <Separator />
            <AppointmentStatus referralId={referral.id} />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ReferralDetailModal;
