
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
    <div className="w-full h-full">
      <VitalSignSelector 
        selectedType={selectedVitalType} 
        onSelectType={setSelectedVitalType} 
      />

      <div className="w-full h-fit">
        <ChartDisplay 
          vitalSigns={vitalSigns}
          selectedVitalType={selectedVitalType}
        />
      </div>
    </div>
  );
};

export default VitalSignsContainer;
