
import { useParams, useNavigate } from 'react-router-dom';
import Titlebar from '@/components/Titlebar';
import PageHeader from '@/components/PageHeader';
import ReferralViewHeader from '@/components/referral-view/ReferralViewHeader';
import ReferralViewSkeleton from '@/components/referral-view/ReferralViewSkeleton';
import ReferralViewNotFound from '@/components/referral-view/ReferralViewNotFound';
import ReferralViewContent from '@/components/referral-view/ReferralViewContent';
import { useReferralData } from '@/hooks/useReferralData';

const ReferralView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { referral, relatedReferrals, isLoading, loadReferral } = useReferralData(id);

  const handleBack = () => {
    navigate(-1);
  };

  const handleStatusChange = () => {
    loadReferral();
  };

  const handleDocumentUploaded = () => {
    loadReferral(); // Refresh to show new documents
  };

  if (isLoading) {
    return <ReferralViewSkeleton onBack={handleBack} />;
  }

  if (!referral) {
    return <ReferralViewNotFound onBack={handleBack} />;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Titlebar />
      <PageHeader showSearch={false} />
      
      <div className="flex-1 container mx-auto px-6 max-w-none flex flex-col min-h-0">
        <div className="flex-shrink-0 pb-4 pt-4">
          <ReferralViewHeader referral={referral} onBack={handleBack} />
        </div>
        
        <div className="flex-1 min-h-0">
          <ReferralViewContent
            referral={referral}
            relatedReferrals={relatedReferrals}
            onStatusChange={handleStatusChange}
            onDocumentUploaded={handleDocumentUploaded}
          />
        </div>
      </div>
    </div>
  );
};

export default ReferralView;
