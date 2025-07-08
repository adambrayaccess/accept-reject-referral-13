
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { LayoutList, Plus, ExternalLink } from 'lucide-react';
import { Referral } from '@/types/referral';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface SubReferralIndicatorProps {
  referral: Referral;
  variant?: 'default' | 'compact';
}

interface ParentReferralInfo {
  id: string;
  specialty: string;
  service?: string;
  triage_status?: string;
  status: string;
}

const SubReferralIndicator = ({ referral, variant = 'default' }: SubReferralIndicatorProps) => {
  const [parentReferral, setParentReferral] = useState<ParentReferralInfo | null>(null);
  const [isLoadingParent, setIsLoadingParent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParentReferral = async () => {
      if (!referral.parentReferralId) return;
      
      setIsLoadingParent(true);
      try {
        const { data, error } = await supabase
          .from('referrals')
          .select('id, specialty, service, triage_status, status')
          .eq('id', referral.parentReferralId)
          .single();
          
        if (error) {
          console.error('Error fetching parent referral:', error);
        } else {
          setParentReferral(data);
        }
      } catch (error) {
        console.error('Error fetching parent referral:', error);
      } finally {
        setIsLoadingParent(false);
      }
    };

    if (referral.isSubReferral && referral.parentReferralId) {
      fetchParentReferral();
    }
  }, [referral.parentReferralId, referral.isSubReferral]);

  const handleParentClick = () => {
    if (referral.parentReferralId) {
      navigate(`/referral/${referral.parentReferralId}`);
    }
  };
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
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Sub-Referral Details</h4>
              <div className="text-sm text-muted-foreground">
                This is a sub-referral of another referral in the system.
              </div>
              {subReferralInfo.parentReferralId && (
                <div className="space-y-2 p-3 bg-muted/20 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Parent Referral:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleParentClick}
                      className="h-auto p-1 text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                  {isLoadingParent ? (
                    <div className="text-xs text-muted-foreground">Loading...</div>
                  ) : parentReferral ? (
                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="font-medium">Service:</span> {parentReferral.service || parentReferral.specialty}
                      </div>
                      <div>
                        <span className="font-medium">Triage Status:</span> {
                          parentReferral.triage_status 
                            ? parentReferral.triage_status.charAt(0).toUpperCase() + parentReferral.triage_status.slice(1).replace('-', ' ')
                            : parentReferral.status.charAt(0).toUpperCase() + parentReferral.status.slice(1)
                        }
                      </div>
                      <div className="text-muted-foreground pt-1">
                        ID: {subReferralInfo.parentReferralId}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      Unable to load parent referral details
                    </div>
                  )}
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
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Parent: {parentReferral ? 
                  `${parentReferral.service || parentReferral.specialty} - ${
                    parentReferral.triage_status 
                      ? parentReferral.triage_status.charAt(0).toUpperCase() + parentReferral.triage_status.slice(1).replace('-', ' ')
                      : parentReferral.status.charAt(0).toUpperCase() + parentReferral.status.slice(1)
                  }` 
                  : subReferralInfo.parentReferralId
                }
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleParentClick}
                className="h-auto p-1 text-primary hover:text-primary/80"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
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
