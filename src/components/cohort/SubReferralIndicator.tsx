
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { LayoutList, Plus } from 'lucide-react';
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
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="flex items-center gap-1 cursor-pointer">
              <LayoutList className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-blue-600">Sub-referral</span>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 p-4" side="top">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Sub-Referral Details</h4>
              <div className="text-sm text-muted-foreground">
                This is a sub-referral of another referral in the system.
              </div>
              {subReferralInfo.parentReferralId && (
                <div className="text-sm">
                  <span className="font-medium">Parent Referral ID:</span>
                  <br />
                  <span className="text-muted-foreground">{subReferralInfo.parentReferralId}</span>
                </div>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    }
    
    if (subReferralInfo.hasSubReferrals) {
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="flex items-center gap-1 cursor-pointer">
              <LayoutList className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">
                {subReferralInfo.subReferralCount} sub-referral{subReferralInfo.subReferralCount > 1 ? 's' : ''}
              </span>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 p-4" side="top">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Sub-Referrals</h4>
              <div className="text-sm text-muted-foreground">
                This referral has {subReferralInfo.subReferralCount} linked sub-referral{subReferralInfo.subReferralCount > 1 ? 's' : ''}.
              </div>
              {referral.childReferralIds && (
                <div className="text-sm">
                  <span className="font-medium">Sub-Referral IDs:</span>
                  <div className="mt-1 space-y-1">
                    {referral.childReferralIds.map((id, index) => (
                      <div key={id} className="text-muted-foreground">
                        {index + 1}. {id}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    }
    
    return null;
  }

  return (
    <div className="space-y-1">
      {subReferralInfo.isSubReferral && (
        <div className="space-y-1">
          <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200">
            <LayoutList className="h-3 w-3 mr-1 text-blue-500" />
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
            <LayoutList className="h-3 w-3 mr-1 text-green-500" />
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
