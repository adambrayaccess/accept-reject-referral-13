
import { VitalSign } from '@/types/medical';
import { NEWS2Details } from './NEWS2Details';

interface VitalSignsTabProps {
  vitalSigns: VitalSign[] | undefined;
}

const VitalSignsTab = ({ vitalSigns }: VitalSignsTabProps) => {
  const hasVitalSigns = vitalSigns && vitalSigns.length > 0;

  if (!hasVitalSigns) {
    return <p className="text-muted-foreground">No vital signs data available for this patient.</p>;
  }

  // Sort vital signs by timestamp
  const sortedVitalSigns = [...vitalSigns].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="pb-8">
      <NEWS2Details vitalSigns={sortedVitalSigns} />
    </div>
  );
};

export default VitalSignsTab;
