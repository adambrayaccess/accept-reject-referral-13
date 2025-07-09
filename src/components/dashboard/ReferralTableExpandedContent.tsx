import { useState, useEffect } from 'react';
import { Referral } from '@/types/referral';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, LayoutList, ArrowUp } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { fetchParentReferral, fetchChildReferrals } from '@/services/referralService';

interface ReferralTableExpandedContentProps {
  referral: Referral;
}

const getPriorityVariant = (priority: Referral['priority']) => {
  switch (priority) {
    case 'emergency':
      return 'destructive';
    case 'urgent':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getStatusColor = (status: Referral['status']) => {
  switch (status) {
    case 'new':
      return 'bg-blue-500';
    case 'accepted':
      return 'bg-green-500';
    case 'rejected':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const ReferralTableExpandedContent = ({ referral }: ReferralTableExpandedContentProps) => {
  const [parentReferral, setParentReferral] = useState<Referral | null>(null);
  const [subReferrals, setSubReferrals] = useState<Referral[]>([]);
  const [isLoadingParent, setIsLoadingParent] = useState(false);
  const [isLoadingSubs, setIsLoadingSubs] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadParentReferral = async () => {
      if (!referral.isSubReferral || !referral.parentReferralId) return;
      
      setIsLoadingParent(true);
      try {
        const data = await fetchParentReferral(referral.id);
        setParentReferral(data);
      } catch (error) {
        console.error('Error fetching parent referral:', error);
      } finally {
        setIsLoadingParent(false);
      }
    };

    const loadSubReferrals = async () => {
      if (referral.isSubReferral) return;
      
      setIsLoadingSubs(true);
      try {
        const data = await fetchChildReferrals(referral.id);
        setSubReferrals(data);
      } catch (error) {
        console.error('Error fetching sub-referrals:', error);
      } finally {
        setIsLoadingSubs(false);
      }
    };

    loadParentReferral();
    loadSubReferrals();
  }, [referral.id, referral.isSubReferral, referral.parentReferralId]);

  const handleViewReferral = (referralId: string) => {
    navigate(`/referral/${referralId}`);
  };

  const renderParentReferral = () => {
    if (!referral.isSubReferral) return null;

    if (isLoadingParent) {
      return (
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUp className="h-4 w-4" />
            <span className="font-medium text-sm">Parent Referral</span>
          </div>
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      );
    }

    if (!parentReferral) {
      return (
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUp className="h-4 w-4" />
            <span className="font-medium text-sm">Parent Referral</span>
          </div>
          <div className="text-sm text-muted-foreground">No parent referral found</div>
        </div>
      );
    }

    return (
      <div className="p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <ArrowUp className="h-4 w-4" />
          <span className="font-medium text-sm">Parent Referral</span>
        </div>
        <div className="border rounded-lg p-3 bg-background">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(parentReferral.status)}`}></div>
                <span className="font-medium text-sm">{parentReferral.specialty}</span>
                {parentReferral.service && (
                  <span className="text-xs text-muted-foreground">- {parentReferral.service}</span>
                )}
                <Badge variant={getPriorityVariant(parentReferral.priority)} className="text-xs">
                  {parentReferral.priority.toUpperCase()}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                Created: {format(new Date(parentReferral.created), 'dd MMM yyyy, HH:mm')}
              </div>
              <div className="text-sm">{parentReferral.clinicalInfo.reason}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Ref: {parentReferral.id} | UBRN: {parentReferral.ubrn}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewReferral(parentReferral.id)}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderSubReferrals = () => {
    if (referral.isSubReferral) return null;

    if (isLoadingSubs) {
      return (
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <LayoutList className="h-4 w-4" />
            <span className="font-medium text-sm">Sub-referrals</span>
          </div>
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      );
    }

    if (subReferrals.length === 0) {
      return (
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <LayoutList className="h-4 w-4" />
            <span className="font-medium text-sm">Sub-referrals</span>
          </div>
          <div className="text-sm text-muted-foreground">No sub-referrals found</div>
        </div>
      );
    }

    return (
      <div className="p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <LayoutList className="h-4 w-4" />
          <span className="font-medium text-sm">Sub-referrals ({subReferrals.length})</span>
        </div>
        <div className="space-y-3">
          {subReferrals.map((subReferral) => (
            <div key={subReferral.id} className="border rounded-lg p-3 bg-background">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(subReferral.status)}`}></div>
                    <span className="font-medium text-sm">{subReferral.specialty}</span>
                    {subReferral.service && (
                      <span className="text-xs text-muted-foreground">- {subReferral.service}</span>
                    )}
                    <Badge variant={getPriorityVariant(subReferral.priority)} className="text-xs">
                      {subReferral.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Created: {format(new Date(subReferral.created), 'dd MMM yyyy, HH:mm')}
                  </div>
                  <div className="text-sm">{subReferral.clinicalInfo.reason}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Ref: {subReferral.id} | UBRN: {subReferral.ubrn}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewReferral(subReferral.id)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Always show some content, even if minimal
  return (
    <div className="px-2 py-3 bg-muted/20">
      <div className="space-y-3">
        {renderParentReferral()}
        {renderSubReferrals()}
        {!referral.isSubReferral && subReferrals.length === 0 && !isLoadingSubs && (
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="text-sm text-muted-foreground">No related referrals found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralTableExpandedContent;