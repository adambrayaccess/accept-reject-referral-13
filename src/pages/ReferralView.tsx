
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchReferralById, fetchPatientReferrals } from '@/services/referralService';
import { Referral } from '@/types/referral';
import ReferralDetail from '@/components/ReferralDetail';
import ReferralDocuments from '@/components/ReferralDocuments';
import ReferralActions from '@/components/ReferralActions';
import MedicalHistory from '@/components/MedicalHistory';
import Titlebar from '@/components/Titlebar';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ReferralWorkspace from '@/components/ReferralWorkspace';
import PatientActivityTimeline from '@/components/PatientActivityTimeline';
import { Badge } from '@/components/ui/badge';
import TriageStatusBadge from '@/components/triage/TriageStatusBadge';

const ReferralView = () => {
  const { id } = useParams<{ id: string }>();
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
    loadReferral();
  }, [id]); // Re-load when the ID changes (important for parent-child navigation)

  const handleStatusChange = () => {
    loadReferral();
  };

  const handleDocumentUploaded = () => {
    loadReferral(); // Refresh to show new documents
  };

  const handleBack = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Titlebar />
        <PageHeader showSearch={false} />
        <div className="container py-3 space-y-4">
          <Button variant="ghost" onClick={handleBack} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <Skeleton className="w-full h-[400px] rounded-lg" />
          <Skeleton className="w-full h-[300px] rounded-lg" />
          <Skeleton className="w-full h-[100px] rounded-lg" />
        </div>
      </div>
    );
  }

  if (!referral) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Titlebar />
        <PageHeader showSearch={false} />
        <div className="container py-3">
          <Button variant="ghost" onClick={handleBack} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold mb-2">Referral Not Found</h2>
            <p className="text-muted-foreground mb-6">The referral you're looking for doesn't exist or has been removed.</p>
            <Button onClick={handleBack}>Return to Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Titlebar />
      <PageHeader showSearch={false} />
      
      <div className="container py-3 max-w-none">
        <Button variant="ghost" onClick={handleBack} className="mb-3">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold">{referral.patient.name}</h1>
              {referral.isSubReferral && (
                <Badge variant="outline" className="text-xs">Sub-referral</Badge>
              )}
              {referral.status === 'accepted' && (
                <TriageStatusBadge status={referral.triageStatus} />
              )}
            </div>
            <p className="text-muted-foreground">
              NHS: <span className="font-mono">{referral.patient.nhsNumber}</span>
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-[1fr,500px] gap-4 h-[calc(100vh-200px)]">
          <div className="overflow-hidden">
            <ScrollArea className="h-full">
              <div className="pr-3 space-y-4">
                <ReferralDetail 
                  referral={referral} 
                  relatedReferrals={relatedReferrals}
                />
                <MedicalHistory patient={referral.patient} />
                <ReferralDocuments 
                  attachments={referral.attachments} 
                  referralId={referral.id}
                  onDocumentUploaded={handleDocumentUploaded}
                />
              </div>
            </ScrollArea>
          </div>
          
          <div className="overflow-hidden">
            <ScrollArea className="h-full">
              <div className="pr-3">
                <ReferralWorkspace 
                  referral={referral}
                  onStatusChange={handleStatusChange}
                />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralView;
