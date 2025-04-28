
import { useState } from 'react';
import { VitalSign } from '@/types/referral';
import VitalSignSelector, { VitalSignType } from './VitalSignSelector';
import ChartDisplay from './ChartDisplay';

interface VitalSignsContainerProps {
  vitalSigns: VitalSign[];
}

const VitalSignsContainer = ({ vitalSigns }: VitalSignsContainerProps) => {
  const [selectedVitalType, setSelectedVitalType] = useState<VitalSignType>('news2');

  return (
    <div className="w-full overflow-hidden">
      <VitalSignSelector 
        selectedType={selectedVitalType} 
        onSelectType={setSelectedVitalType} 
      />

      <ChartDisplay 
        vitalSigns={vitalSigns}
        selectedVitalType={selectedVitalType}
      />
    </div>
  );
};

export default VitalSignsContainer;
