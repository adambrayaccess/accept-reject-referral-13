
import { VitalSign } from '@/types/referral';
import NEWS2Chart from './charts/NEWS2Chart';
import TemperatureChart from './charts/TemperatureChart';
import HeartRateChart from './charts/HeartRateChart';
import RespirationChart from './charts/RespirationChart';
import { VitalSignType } from './VitalSignSelector';

interface ChartDisplayProps {
  vitalSigns: VitalSign[];
  selectedVitalType: VitalSignType;
}

const ChartDisplay = ({ vitalSigns, selectedVitalType }: ChartDisplayProps) => {
  return (
    <div className="h-[300px] w-full pb-6">
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
  );
};

export default ChartDisplay;
