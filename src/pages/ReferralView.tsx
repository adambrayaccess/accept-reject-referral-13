import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchReferralById, fetchPatientReferrals } from '@/services/referralService';
import { Referral } from '@/types/referral';
import ReferralDetail from '@/components/ReferralDetail';
import AttachmentViewer from '@/components/AttachmentViewer';
import ReferralActions from '@/components/ReferralActions';
import MedicalHistory from '@/components/MedicalHistory';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ReferralView = () => {
  const { id } = useParams<{ id: string }>();
  const [referral, setReferral] = useState<Referral | null>(null);
  const [relatedReferrals, setRelatedReferrals] = useState<{
    serviceTotal: number;
    activeTotal: number;
  }>({ serviceTotal: 0, activeTotal: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadReferral = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const data = await fetchReferralById(id);
      
      if (!data) {
        toast({
          title: 'Error',
          description: 'Referral not found',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }
      
      setReferral(data);
      
      const patientReferrals = await fetchPatientReferrals(data.patient.id);
      const serviceReferrals = patientReferrals.filter(ref => ref.specialty === data.specialty && ref.id !== data.id);
      const activeReferrals = patientReferrals.filter(ref => ref.status !== 'rejected' && ref.id !== data.id);
      
      setRelatedReferrals({
        serviceTotal: serviceReferrals.length,
        activeTotal: activeReferrals.length,
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
    loadReferral();
  }, [id]);

  const handleStatusChange = () => {
    loadReferral();
  };

  const handleBack = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="container py-6 space-y-6">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <Skeleton className="w-full h-[400px] rounded-lg" />
        <Skeleton className="w-full h-[300px] rounded-lg" />
        <Skeleton className="w-full h-[100px] rounded-lg" />
      </div>
    );
  }

  if (!referral) {
    return (
      <div className="container py-6">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-bold mb-2">Referral Not Found</h2>
          <p className="text-muted-foreground mb-6">The referral you're looking for doesn't exist or has been removed.</p>
          <Button onClick={handleBack}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <Button variant="ghost" onClick={handleBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{referral.patient.name}</h1>
          <p className="text-muted-foreground">
            NHS: <span className="font-mono">{referral.patient.nhsNumber}</span>
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <ReferralDetail 
          referral={referral} 
          relatedReferrals={relatedReferrals}
        />
        <MedicalHistory patient={referral.patient} />
        <AttachmentViewer attachments={referral.attachments} />
        <ReferralActions referral={referral} onStatusChange={handleStatusChange} />
      </div>
    </div>
  );
};

export default ReferralView;
