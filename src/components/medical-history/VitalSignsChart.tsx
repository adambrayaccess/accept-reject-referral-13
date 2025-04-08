
import { useState } from 'react';
import { VitalSign } from '@/types/referral';
import VitalSignSelector, { VitalSignType } from './VitalSignSelector';
import NEWS2Chart from './charts/NEWS2Chart';
import TemperatureChart from './charts/TemperatureChart';
import HeartRateChart from './charts/HeartRateChart';
import RespirationChart from './charts/RespirationChart';

interface VitalSignsChartProps {
  vitalSigns: VitalSign[];
}

const VitalSignsChart = ({ vitalSigns }: VitalSignsChartProps) => {
  const [selectedVitalType, setSelectedVitalType] = useState<VitalSignType>('news2');

  return (
    <>
      <VitalSignSelector 
        selectedType={selectedVitalType} 
        onSelectType={setSelectedVitalType} 
      />

      <div className="h-[250px] w-full">
        {selectedVitalType === 'news2' && (
          <NEWS2Chart vitalSigns={vitalSigns} />
        )}
        
        {selectedVitalType === 'temperature' && (
          <TemperatureChart vitalSigns={vitalSigns} />
        )}
        
        {selectedVitalType === 'heartRate' && (
          <HeartRateChart vitalSigns={vitalSigns} />
        )}
        
        {selectedVitalType === 'respiration' && (
          <RespirationChart vitalSigns={vitalSigns} />
        )}
      </div>
    </>
  );
};

export default VitalSignsChart;
