
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitBranch, Plus, Users } from 'lucide-react';
import { Referral } from '@/types/referral';

interface SubReferralIndicatorProps {
  referral: Referral;
  variant?: 'default' | 'compact';
}

const SubReferralIndicator = ({ referral, variant = 'default' }: SubReferralIndicatorProps) => {
  // Mock sub-referral data based on referral status and age
  const getSubReferralInfo = () => {
    const hasSubReferrals = referral.status === 'accepted' && Math.random() > 0.7;
    const subReferralCount = hasSubReferrals ? Math.floor(Math.random() * 3) + 1 : 0;
    const canCreateSubReferral = referral.status === 'accepted' && !referral.isSubReferral;
    
    return {
      hasSubReferrals,
      subReferralCount,
      canCreateSubReferral,
      isSubReferral: referral.isSubReferral || false
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
        <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200">
          <GitBranch className="h-3 w-3 mr-1 text-blue-500" />
          Sub-referral
        </Badge>
      )}
      
      {subReferralInfo.hasSubReferrals && (
        <Badge variant="outline" className="text-xs bg-green-50 border-green-200">
          <Users className="h-3 w-3 mr-1 text-green-500" />
          {subReferralInfo.subReferralCount} Sub-referral{subReferralInfo.subReferralCount > 1 ? 's' : ''}
        </Badge>
      )}
      
      {subReferralInfo.canCreateSubReferral && !subReferralInfo.hasSubReferrals && (
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
