
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitBranch, Plus, Users } from 'lucide-react';
import { Referral } from '@/types/referral';

interface SubReferralIndicatorProps {
  referral: Referral;
  variant?: 'default' | 'compact';
}

const SubReferralIndicator = ({ referral, variant = 'default' }: SubReferralIndicatorProps) => {
  const getSubReferralInfo = () => {
    const hasSubReferrals = referral.childReferralIds && referral.childReferralIds.length > 0;
    const subReferralCount = referral.childReferralIds?.length || 0;
    const canCreateSubReferral = referral.status === 'accepted' && !referral.isSubReferral && !hasSubReferrals;
    
    return {
      hasSubReferrals: !!hasSubReferrals,
      subReferralCount,
      canCreateSubReferral,
      isSubReferral: referral.isSubReferral || false,
      parentReferralId: referral.parentReferralId
    };
  };

  const subReferralInfo = getSubReferralInfo();

  if (variant === 'compact') {
    if (subReferralInfo.isSubReferral) {
      return (
        <div className="flex items-center gap-1">
          <GitBranch className="h-3 w-3 text-blue-500" />
          <span className="text-xs text-blue-600">Sub-referral</span>
        </div>
      );
    }
    
    if (subReferralInfo.hasSubReferrals) {
      return (
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3 text-green-500" />
          <span className="text-xs text-green-600">
            {subReferralInfo.subReferralCount} sub-referral{subReferralInfo.subReferralCount > 1 ? 's' : ''}
          </span>
        </div>
      );
    }
    
    return null;
  }

  return (
    <div className="space-y-1">
      {subReferralInfo.isSubReferral && (
        <div className="space-y-1">
          <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200">
            <GitBranch className="h-3 w-3 mr-1 text-blue-500" />
            Sub-referral
          </Badge>
          {subReferralInfo.parentReferralId && (
            <div className="text-xs text-muted-foreground">
              Parent: {subReferralInfo.parentReferralId}
            </div>
          )}
        </div>
      )}
      
      {subReferralInfo.hasSubReferrals && (
        <div className="space-y-1">
          <Badge variant="outline" className="text-xs bg-green-50 border-green-200">
            <Users className="h-3 w-3 mr-1 text-green-500" />
            {subReferralInfo.subReferralCount} Sub-referral{subReferralInfo.subReferralCount > 1 ? 's' : ''}
          </Badge>
          <div className="text-xs text-muted-foreground">
            IDs: {referral.childReferralIds?.join(', ')}
          </div>
        </div>
      )}
      
      {subReferralInfo.canCreateSubReferral && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs text-muted-foreground hover:text-primary"
        >
          <Plus className="h-3 w-3 mr-1" />
          Create Sub-referral
        </Button>
      )}
    </div>
  );
};

export default SubReferralIndicator;
