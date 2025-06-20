
import InlineServiceSelector from '../InlineServiceSelector';
import CreateReferralDropdown from './CreateReferralDropdown';
import { Referral } from '@/types/referral';

interface DashboardHeaderProps {
  selectedServices: string[];
  serviceNames: string[];
  onServiceSelectionChange: (newSelection: string[]) => void;
  onReferralCreated: (newReferral: Partial<Referral>) => void;
}

const DashboardHeader = ({
  selectedServices,
  serviceNames,
  onServiceSelectionChange,
  onReferralCreated
}: DashboardHeaderProps) => {
  return (
    <div className="px-6 py-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Referral Dashboard</h1>
          <div className="flex items-center mt-1">
            <span className="text-sm text-muted-foreground mr-2">Triaging for:</span>
            <InlineServiceSelector
              services={serviceNames}
              selectedServices={selectedServices}
              onSelectionChange={onServiceSelectionChange}
            />
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <CreateReferralDropdown onReferralCreated={onReferralCreated} />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
