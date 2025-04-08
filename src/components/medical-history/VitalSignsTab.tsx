
import { VitalSign } from '@/types/referral';
import VitalSignsContainer from './VitalSignsContainer';

interface VitalSignsTabProps {
  vitalSigns: VitalSign[] | undefined;
}

const VitalSignsTab = ({ vitalSigns }: VitalSignsTabProps) => {
  const hasVitalSigns = vitalSigns && vitalSigns.length > 0;

  if (!hasVitalSigns) {
    return <p className="text-muted-foreground">No vital signs data available for this patient.</p>;
  }

  return (
    <div className="pb-4">
      <VitalSignsContainer vitalSigns={vitalSigns} />
    </div>
  );
};

export default VitalSignsTab;
