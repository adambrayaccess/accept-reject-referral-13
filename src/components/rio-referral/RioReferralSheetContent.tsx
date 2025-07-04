import { useEffect, useState } from 'react';
import { Referral } from '@/types/referral';
import { fetchReferralById } from '@/services/referral/singleReferralService';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface RioReferralSheetContentProps {
  referralId: string;
}

const RioReferralSheetContent = ({ referralId }: RioReferralSheetContentProps) => {
  const [referral, setReferral] = useState<Referral | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReferral = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const referralData = await fetchReferralById(referralId);
        
        if (!referralData) {
          setError('Referral not found');
          return;
        }
        
        setReferral(referralData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load referral details';
        setError(errorMessage);
        console.error('Error loading referral:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (referralId) {
      loadReferral();
    }
  }, [referralId]);

  if (isLoading) {
    return (
      <div className="space-y-6 pb-6">
        <Skeleton className="w-full h-32" />
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-40" />
        <Skeleton className="w-full h-32" />
      </div>
    );
  }

  if (error || !referral) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {error || 'Failed to load referral details'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Referrer Information Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Referrer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <div className="text-xs font-medium text-muted-foreground">Referrer Name</div>
              <div className="font-medium">{referral.referrer.name}</div>
            </div>
            
            {referral.referrer.role && (
              <div>
                <div className="text-xs font-medium text-muted-foreground">Role</div>
                <div className="font-medium">{referral.referrer.role}</div>
              </div>
            )}
            
            {referral.referrer.organization && (
              <div>
                <div className="text-xs font-medium text-muted-foreground">Organization</div>
                <div className="font-medium">{referral.referrer.organization}</div>
              </div>
            )}
            
            {referral.referrer.contact && (
              <div>
                <div className="text-xs font-medium text-muted-foreground">Contact</div>
                <div className="font-medium">{referral.referrer.contact}</div>
              </div>
            )}
            
            <div>
              <div className="text-xs font-medium text-muted-foreground">Date Referred</div>
              <div className="font-medium">{format(new Date(referral.created), 'dd MMM yyyy, HH:mm')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Details Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Referral Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <div className="text-xs font-medium text-muted-foreground">UBRN</div>
              <div className="font-medium">{referral.ubrn}</div>
            </div>
            
            <div>
              <div className="text-xs font-medium text-muted-foreground">Specialty</div>
              <div className="font-medium">{referral.specialty}</div>
            </div>
            
            {referral.service && (
              <div>
                <div className="text-xs font-medium text-muted-foreground">Service</div>
                <div className="font-medium">{referral.service}</div>
              </div>
            )}
            
            {referral.originatingSpecialty && (
              <div>
                <div className="text-xs font-medium text-muted-foreground">Originating Specialty</div>
                <div className="font-medium">{referral.originatingSpecialty}</div>
              </div>
            )}
            
            {referral.originatingTeam && (
              <div>
                <div className="text-xs font-medium text-muted-foreground">Originating Team</div>
                <div className="font-medium">{referral.originatingTeam}</div>
              </div>
            )}
            
            {referral.referralType && (
              <div>
                <div className="text-xs font-medium text-muted-foreground">Referral Type</div>
                <div className="font-medium">{referral.referralType}</div>
              </div>
            )}
            
            {referral.patientAreaCareSetting && (
              <div>
                <div className="text-xs font-medium text-muted-foreground">Patient Area/Care Setting</div>
                <div className="font-medium">{referral.patientAreaCareSetting}</div>
              </div>
            )}
            
            {referral.externalReference && (
              <div>
                <div className="text-xs font-medium text-muted-foreground">External Reference</div>
                <div className="font-medium">{referral.externalReference}</div>
              </div>
            )}
            
            {referral.camhsServiceTier && (
              <div>
                <div className="text-xs font-medium text-muted-foreground">CAMHS Service Tier</div>
                <div className="font-medium">{referral.camhsServiceTier}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Clinical Information Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Clinical Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-2">Reason for Referral</div>
            <div className="text-sm">{referral.clinicalInfo.reason}</div>
          </div>
          
          {referral.clinicalInfo.history && (
            <>
              <Separator />
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">Clinical History</div>
                <div className="text-sm">{referral.clinicalInfo.history}</div>
              </div>
            </>
          )}
          
          {referral.clinicalInfo.diagnosis && (
            <>
              <Separator />
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">Diagnosis</div>
                <div className="text-sm">{referral.clinicalInfo.diagnosis}</div>
              </div>
            </>
          )}
          
          {referral.clinicalInfo.notes && (
            <>
              <Separator />
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">Additional Notes</div>
                <div className="text-sm">{referral.clinicalInfo.notes}</div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Administrative Information Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Administrative Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <div className="text-xs font-medium text-muted-foreground">Status</div>
              <div className="font-medium capitalize">{referral.status.replace('_', ' ')}</div>
            </div>
            
            <div>
              <div className="text-xs font-medium text-muted-foreground">Priority</div>
              <div className="font-medium capitalize">{referral.priority}</div>
            </div>
            
            {referral.administrativeCategory && (
              <div>
                <div className="text-xs font-medium text-muted-foreground">Administrative Category</div>
                <div className="font-medium">{referral.administrativeCategory}</div>
              </div>
            )}
            
            {referral.overseasStatus && (
              <div>
                <div className="text-xs font-medium text-muted-foreground">Overseas Status</div>
                <div className="font-medium">{referral.overseasStatus}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RioReferralSheetContent;