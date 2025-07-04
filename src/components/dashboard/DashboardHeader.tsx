
import { useState } from 'react';
import InlineSpecialtySelector from '../InlineSpecialtySelector';
import CreateReferralDropdown from './CreateReferralDropdown';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { Referral } from '@/types/referral';

interface DashboardHeaderProps {
  selectedSpecialties: string[];
  specialtyNames: string[];
  onSpecialtySelectionChange: (newSelection: string[]) => void;
  onReferralCreated: (newReferral: Partial<Referral>) => void;
  onRefresh: () => void;
}

const DashboardHeader = ({
  selectedSpecialties,
  specialtyNames,
  onSpecialtySelectionChange,
  onReferralCreated,
  onRefresh
}: DashboardHeaderProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

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
          <Button 
            variant="outline" 
            size="default" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <CreateReferralDropdown onReferralCreated={onReferralCreated} />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
