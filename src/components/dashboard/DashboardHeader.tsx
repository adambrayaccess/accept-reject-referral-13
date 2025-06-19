
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
        <div>
          <h1 className="text-2xl font-bold">Referral Dashboard</h1>
          <div className="flex items-center mt-1">
            <span className="text-sm text-muted-foreground mr-2">Triaging for:</span>
            <InlineSpecialtySelector
              specialties={specialtyNames}
              selectedSpecialties={selectedSpecialties}
              onSelectionChange={onSpecialtySelectionChange}
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
