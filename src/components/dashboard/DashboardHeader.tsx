
import InlineSpecialtySelector from '../InlineSpecialtySelector';
import CreateReferralDropdown from './CreateReferralDropdown';
import { Referral } from '@/types/referral';

interface DashboardHeaderProps {
  selectedSpecialties: string[];
  specialtyNames: string[];
  onSpecialtySelectionChange: (newSelection: string[]) => void;
  onReferralCreated: (newReferral: Partial<Referral>) => void;
}

const DashboardHeader = ({
  selectedSpecialties,
  specialtyNames,
  onSpecialtySelectionChange,
  onReferralCreated
}: DashboardHeaderProps) => {
  return (
    <div className="px-6 py-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">Referral Dashboard</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Triaging for:</span>
            <InlineSpecialtySelector
              specialties={specialtyNames}
              selectedSpecialties={selectedSpecialties}
              onSelectionChange={onSpecialtySelectionChange}
            />
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto sm:flex-shrink-0">
          <CreateReferralDropdown onReferralCreated={onReferralCreated} />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
