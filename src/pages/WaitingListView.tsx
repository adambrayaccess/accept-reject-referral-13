import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import WaitingListViewHeader from '@/components/waiting-list-view/WaitingListViewHeader';
import WaitingListViewSkeleton from '@/components/waiting-list-view/WaitingListViewSkeleton';
import WaitingListViewNotFound from '@/components/waiting-list-view/WaitingListViewNotFound';
import WaitingListViewContent from '@/components/waiting-list-view/WaitingListViewContent';
import { useReferralData } from '@/hooks/useReferralData';

const WaitingListView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { referral, relatedReferrals, isLoading, loadReferral } = useReferralData(id);

  const handleBack = () => {
    // Navigate back to waiting list instead of general back
    navigate('/cohort-builder');
  };

  const handleStatusChange = () => {
    loadReferral();
  };

  const handleDocumentUploaded = () => {
    loadReferral(); // Refresh to show new documents
  };

  if (isLoading) {
    return <WaitingListViewSkeleton onBack={handleBack} />;
  }

  if (!referral) {
    return <WaitingListViewNotFound onBack={handleBack} />;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <PageHeader showSearch={false} />
      
      {/* Main container with proper height constraints */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="container mx-auto px-6 max-w-none flex-1 min-h-0 flex flex-col">
          {/* Fixed header */}
          <div className="flex-shrink-0 py-4">
            <WaitingListViewHeader referral={referral} onBack={handleBack} onSuggestionApplied={handleStatusChange} />
          </div>
          
          {/* Scrollable content area */}
          <div className="flex-1 min-h-0">
            <WaitingListViewContent
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

export default WaitingListView;