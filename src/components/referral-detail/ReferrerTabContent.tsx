
import { Referral } from '@/types/referral';
import { format } from 'date-fns';

interface ReferrerTabContentProps {
  referral: Referral;
}

const ReferrerTabContent = ({ referral }: ReferrerTabContentProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-3 text-sm">
      <div>
        <div className="text-xs font-medium text-muted-foreground">Referrer Name</div>
        <div className="font-medium">{referral.referrer.name}</div>
      </div>
      
      {referral.referrer.role && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">Role</div>
          <div className="font-medium">{referral.referrer.role}</div>
        </div>
      )}
      
      {referral.referrer.organization && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">Referral Source</div>
          <div className="font-medium">{referral.referrer.organization}</div>
        </div>
      )}
      
      {referral.referrer.contact && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">Contact</div>
          <div className="font-medium">{referral.referrer.contact}</div>
        </div>
      )}
      
      {referral.referralType && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">Referral Type</div>
          <div className="font-medium">{referral.referralType}</div>
        </div>
      )}
      
      {referral.patientAreaCareSetting && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">Patient Area/Care Setting</div>
          <div className="font-medium">{referral.patientAreaCareSetting}</div>
        </div>
      )}
      
      {referral.externalReference && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">External Reference</div>
          <div className="font-medium">{referral.externalReference}</div>
        </div>
      )}
      
      {referral.camhsServiceTier && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">CAMHS Service Tier</div>
          <div className="font-medium">{referral.camhsServiceTier}</div>
        </div>
      )}
      
      <div>
        <div className="text-xs font-medium text-muted-foreground">Date Referred</div>
        <div className="font-medium">{format(new Date(referral.created), 'dd MMM yyyy, HH:mm')}</div>
      </div>
    </div>
  );
};

export default ReferrerTabContent;
