import { useState, useEffect } from 'react';
// Card components removed - using direct content only
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUp, ExternalLink } from 'lucide-react';
import { Referral } from '@/types/referral';
import { fetchParentReferral } from '@/services/referralService';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface ParentReferralInfoTableProps {
  childReferralId: string;
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

const getStatusVariant = (status: Referral['status']) => {
  switch (status) {
    case 'new':
      return 'default';
    case 'accepted':
      return 'default';
    case 'rejected':
      return 'destructive';
    case 'completed':
      return 'secondary';
    case 'discharged':
      return 'outline';
    default:
      return 'secondary';
  }
};

const ParentReferralInfoTable = ({ childReferralId }: ParentReferralInfoTableProps) => {
  const [parentReferral, setParentReferral] = useState<Referral | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadParentReferral = async () => {
      setIsLoading(true);
      try {
        const data = await fetchParentReferral(childReferralId);
        setParentReferral(data);
      } catch (error) {
        console.error('Error fetching parent referral:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadParentReferral();
  }, [childReferralId]);

  const handleViewParent = () => {
    if (parentReferral) {
      navigate(`/referral/${parentReferral.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Loading parent referral...</div>
    );
  }

  if (!parentReferral) {
    return null;
  }

  return (
    <div className="border rounded-lg p-3 bg-muted/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(parentReferral.status)}`}></div>
            <span className="font-medium text-sm">{parentReferral.specialty}</span>
            {parentReferral.service && (
              <span className="text-xs text-muted-foreground">- {parentReferral.service}</span>
            )}
            <Badge variant={getStatusVariant(parentReferral.status)} className="text-xs">
              {parentReferral.status.toUpperCase()}
            </Badge>
            <Badge variant={getPriorityVariant(parentReferral.priority)} className="text-xs">
              {parentReferral.priority.toUpperCase()}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mb-2">
            Created: {format(new Date(parentReferral.created), 'dd MMM yyyy, HH:mm')}
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-2">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Referral Organisation
              </div>
              <div className="text-xs font-medium">{parentReferral.referrer.organization || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Referral Type
              </div>
              <div className="text-xs font-medium">{parentReferral.referralType || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Referral Source
              </div>
              <div className="text-xs font-medium">{parentReferral.referralSource || 'N/A'}</div>
            </div>
          </div>
          
          <div className="text-sm">{parentReferral.clinicalInfo.reason}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Ref: {parentReferral.id} | UBRN: {parentReferral.ubrn}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewParent}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ParentReferralInfoTable;