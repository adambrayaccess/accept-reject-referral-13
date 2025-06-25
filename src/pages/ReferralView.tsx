
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReferralViewContent from '@/components/referral-view/ReferralViewContent';
import ReferralViewNotFound from '@/components/referral-view/ReferralViewNotFound';
import ReferralViewSkeleton from '@/components/referral-view/ReferralViewSkeleton';
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
    loadReferral();
  };

  if (isLoading) {
    return <ReferralViewSkeleton onBack={handleBack} />;
  }

  if (!referral) {
    return <ReferralViewNotFound onBack={handleBack} />;
  }

  return (
    <div className="pt-0">
      <ReferralViewContent 
        referral={referral}
        relatedReferrals={relatedReferrals}
        onStatusChange={handleStatusChange}
        onDocumentUploaded={handleDocumentUploaded}
      />
    </div>
  );
};

export default ReferralView;
