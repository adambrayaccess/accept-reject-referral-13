import { useState, useEffect } from 'react';
// Card components removed - using direct content only
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, LayoutList, Plus } from 'lucide-react';
import { Referral } from '@/types/referral';
import { fetchChildReferrals } from '@/services/referralService';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import CreateSubReferralSheet from './CreateSubReferralSheet';
interface SubReferralsListTableProps {
  parentReferralId: string;
  onRefresh?: number;
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
const SubReferralsListTable = ({
  parentReferralId,
  onRefresh
}: SubReferralsListTableProps) => {
  const [subReferrals, setSubReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const navigate = useNavigate();
  const loadSubReferrals = async () => {
    setIsLoading(true);
    try {
      const data = await fetchChildReferrals(parentReferralId);
      setSubReferrals(data);
    } catch (error) {
      console.error('Error fetching sub-referrals:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubReferralCreated = () => {
    setRefreshKey(prev => prev + 1);
    loadSubReferrals();
  };
  useEffect(() => {
    loadSubReferrals();
  }, [parentReferralId, onRefresh, refreshKey]);
  const handleViewSubReferral = (subReferralId: string) => {
    navigate(`/referral/${subReferralId}`);
  };
  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading sub-referrals...</div>;
  }
  return <div>
      
      
      {subReferrals.length === 0 ? <div className="text-sm text-muted-foreground">
          No sub-referrals have been created yet.
        </div> : <div className="space-y-3">
          {subReferrals.map(subReferral => <div key={subReferral.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(subReferral.status)}`}></div>
                    <span className="font-medium text-sm">{subReferral.specialty}</span>
                    {subReferral.service && <span className="text-xs text-muted-foreground">- {subReferral.service}</span>}
                    <Badge variant={getStatusVariant(subReferral.status)} className="text-xs">
                      {subReferral.status.toUpperCase()}
                    </Badge>
                    <Badge variant={getPriorityVariant(subReferral.priority)} className="text-xs">
                      {subReferral.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Created: {format(new Date(subReferral.created), 'dd MMM yyyy, HH:mm')}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-2">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Referral Organisation
                      </div>
                      <div className="text-xs font-medium">{subReferral.referrer.organization || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Referral Type
                      </div>
                      <div className="text-xs font-medium">{subReferral.referralType || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Referral Source
                      </div>
                      <div className="text-xs font-medium">{subReferral.referralSource || 'N/A'}</div>
                    </div>
                  </div>
                  
                  <div className="text-sm">{subReferral.clinicalInfo.reason}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Ref: {subReferral.id} | UBRN: {subReferral.ubrn}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleViewSubReferral(subReferral.id)}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>)}
        </div>}
      
      <CreateSubReferralSheet parentReferralId={parentReferralId} onSubReferralCreated={handleSubReferralCreated} isOpen={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen} />
    </div>;
};
export default SubReferralsListTable;