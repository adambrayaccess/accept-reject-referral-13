
import { useParams, useNavigate } from 'react-router-dom';
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
      <PageHeader showSearch={false} />
      
      {/* Main container with proper height constraints */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="container mx-auto px-6 max-w-none flex-1 min-h-0 flex flex-col">
          {/* Fixed header */}
          <div className="flex-shrink-0 py-4">
            <ReferralViewHeader referral={referral} onBack={handleBack} onSuggestionApplied={handleStatusChange} />
          </div>
          
          {/* Scrollable content area */}
          <div className="flex-1 min-h-0">
            <ReferralViewContent
              referral={referral}
              relatedReferrals={relatedReferrals}
              onStatusChange={handleStatusChange}
              onDocumentUploaded={handleDocumentUploaded}
              onSuggestionApplied={handleStatusChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralView;
