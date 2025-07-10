import { useState, useEffect } from 'react';
import { Referral } from '@/types/referral';
import { Button } from '@/components/ui/button';
import { ExternalLink, LayoutList, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import SubReferralDetails from '@/components/SubReferralDetails';
import ParentReferralInfoTable from '@/components/sub-referrals/ParentReferralInfoTable';

interface ReferralTableExpandedContentProps {
  referral: Referral;
}

const ReferralTableExpandedContent = ({ referral }: ReferralTableExpandedContentProps) => {
  // If it's a sub-referral, show parent referral info
  if (referral.isSubReferral) {
    return (
      <div className="w-full bg-muted/20">
        <div className="p-4 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <LayoutList className="h-4 w-4" color="#613249" />
            <span className="font-bold text-sm" style={{ color: '#613249' }}>PARENT REFERRAL</span>
          </div>
          <ParentReferralInfoTable childReferralId={referral.id} />
        </div>
      </div>
    );
  }

  // If it has sub-referrals, show them using the same component as ReferralCard
  if (referral.childReferralIds && referral.childReferralIds.length > 0) {
    return (
      <div className="w-full bg-muted/20">
        <div className="p-4 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <LayoutList className="h-4 w-4" color="#613249" />
            <span className="font-bold text-sm" style={{ color: '#613249' }}>SUB-REFERRALS ({referral.childReferralIds.length})</span>
          </div>
          <SubReferralDetails childReferralIds={referral.childReferralIds} />
        </div>
      </div>
    );
  }

  // Default case: no related referrals
  return (
    <div className="w-full bg-muted/20">
      <div className="p-4 bg-muted/30">
        <div className="text-sm text-muted-foreground">No related referrals found</div>
      </div>
    </div>
  );
};

export default ReferralTableExpandedContent;