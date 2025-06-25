
import React from 'react';
import { useParams } from 'react-router-dom';
import ReferralViewContent from '@/components/referral-view/ReferralViewContent';
import ReferralViewNotFound from '@/components/referral-view/ReferralViewNotFound';
import ReferralViewSkeleton from '@/components/referral-view/ReferralViewSkeleton';
import { useReferralData } from '@/hooks/useReferralData';

const ReferralView = () => {
  const { id } = useParams<{ id: string }>();
  const { referral, loading, error } = useReferralData(id);

  if (loading) {
    return <ReferralViewSkeleton />;
  }

  if (error || !referral) {
    return <ReferralViewNotFound />;
  }

  return (
    <div className="pt-0">
      <ReferralViewContent referral={referral} />
    </div>
  );
};

export default ReferralView;
