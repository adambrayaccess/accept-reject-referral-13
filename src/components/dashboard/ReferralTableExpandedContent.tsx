import { useState, useEffect } from 'react';
import { Referral } from '@/types/referral';
import { Button } from '@/components/ui/button';
import { ExternalLink, LayoutList, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import SubReferralDetails from '@/components/SubReferralDetails';

interface ReferralTableExpandedContentProps {
  referral: Referral;
}

const ReferralTableExpandedContent = ({ referral }: ReferralTableExpandedContentProps) => {
  // If it's a sub-referral, show parent referral info
  if (referral.isSubReferral) {
    return (
      <div className="px-2 py-3 bg-muted/20">
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <ArrowUp className="h-4 w-4" />
            <span className="font-bold text-sm" style={{ color: '#613249' }}>PARENT REFERRAL</span>
          </div>
          <div className="p-3 bg-background rounded space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Parent Referral ID
                </div>
                <div className="text-sm font-medium font-mono">
                  {referral.parentReferralId ? referral.parentReferralId.slice(0, 8) + '...' : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Specialty
                </div>
                <div className="text-sm font-medium">Cardiology</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Status
                </div>
                <div className="text-sm font-medium">Waiting List</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Priority
                </div>
                <div className="text-sm font-medium">Routine</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                UBRN
              </div>
              <div className="text-sm font-medium font-mono">UBRN-{Math.random().toString().slice(2, 12)}</div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-muted-foreground font-bold">
                Created: {new Date().toLocaleDateString()}
              </div>
              {referral.parentReferralId && (
                <Link 
                  to={`/referral/${referral.parentReferralId}`}
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    window.location.href = `/referral/${referral.parentReferralId}`;
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                  View Referral
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If it has sub-referrals, show them using the same component as ReferralCard
  if (referral.childReferralIds && referral.childReferralIds.length > 0) {
    return (
      <div className="px-2 py-3 bg-muted/20">
        <div className="p-4 bg-white rounded-lg">
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
    <div className="px-2 py-3 bg-muted/20">
      <div className="p-4 bg-muted/30 rounded-lg">
        <div className="text-sm text-muted-foreground">No related referrals found</div>
      </div>
    </div>
  );
};

export default ReferralTableExpandedContent;