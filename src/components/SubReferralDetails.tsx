import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface SubReferral {
  id: string;
  specialty: string;
  triage_status: string | null;
  ubrn: string;
  priority: string;
  created_at: string;
}

interface SubReferralDetailsProps {
  childReferralIds: string[];
}

const SubReferralDetails = ({ childReferralIds }: SubReferralDetailsProps) => {
  const [subReferrals, setSubReferrals] = useState<SubReferral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubReferrals = async () => {
      if (!childReferralIds || childReferralIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching sub-referral details for IDs:', childReferralIds);
        
        const { data, error } = await supabase
          .from('referrals')
          .select('id, specialty, triage_status, ubrn, priority, created_at')
          .in('id', childReferralIds)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching sub-referrals:', error);
        } else {
          console.log('Fetched sub-referral details:', data);
          setSubReferrals(data || []);
        }
      } catch (error) {
        console.error('Error fetching sub-referrals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubReferrals();
  }, [childReferralIds]);

  const getStatusDisplay = (triageStatus: string | null) => {
    if (!triageStatus) return 'New';
    
    switch (triageStatus) {
      case 'pre-assessment':
        return 'Pre-Assessment';
      case 'assessed':
        return 'Assessed';
      case 'waiting-list':
        return 'Waiting List';
      case 'refer-to-another-specialty':
        return 'Refer on';
      default:
        return triageStatus;
    }
  };

  const getPriorityDisplay = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'Urgent';
      case 'routine':
        return 'Routine';
      case 'soon':
        return 'Soon';
      default:
        return priority || 'Routine';
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {childReferralIds.map((id, index) => (
          <div key={id} className="p-3 bg-muted/50 rounded animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (subReferrals.length === 0) {
    return (
      <div className="p-3 text-sm text-muted-foreground">
        No sub-referral details available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {subReferrals.map((subReferral) => (
        <div key={subReferral.id} className="p-3 bg-muted/50 rounded space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Sub-Referral ID
              </div>
              <div className="text-sm font-medium font-mono">
                {subReferral.id.slice(0, 8)}...
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Specialty
              </div>
              <div className="text-sm font-medium">{subReferral.specialty}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Status
              </div>
              <div className="text-sm font-medium">
                {getStatusDisplay(subReferral.triage_status)}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Priority
              </div>
              <div className="text-sm font-medium">
                {getPriorityDisplay(subReferral.priority)}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              UBRN
            </div>
            <div className="text-sm font-medium font-mono">{subReferral.ubrn}</div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">
              <span className="font-bold">Created:</span> {new Date(subReferral.created_at).toLocaleDateString()}
            </div>
            <Link 
              to={`/referral/${subReferral.id}`}
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-bold"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                window.location.href = `/referral/${subReferral.id}`;
              }}
            >
              <ExternalLink className="h-3 w-3" />
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubReferralDetails;