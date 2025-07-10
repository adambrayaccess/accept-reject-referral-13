import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import SubReferralsListTable from '@/components/sub-referrals/SubReferralsListTable';

interface SubReferralDetailsProps {
  childReferralIds: string[];
  parentReferralId?: string;
}

const SubReferralDetails = ({ childReferralIds, parentReferralId }: SubReferralDetailsProps) => {
  // If we have a parentReferralId, use SubReferralsListTable
  if (parentReferralId) {
    return <SubReferralsListTable parentReferralId={parentReferralId} />;
  }
  
  // Fallback - this shouldn't normally happen in the refactored structure
  return (
    <div className="p-3 text-sm text-muted-foreground">
      No parent referral ID provided for sub-referrals display
    </div>
  );
};

export default SubReferralDetails;