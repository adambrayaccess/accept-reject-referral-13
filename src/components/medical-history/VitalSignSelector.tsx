
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type VitalSignType = 'news2' | 'temperature' | 'heartRate' | 'respiration';

interface VitalSignSelectorProps {
  selectedType: VitalSignType;
  onSelectType: (type: VitalSignType) => void;
}

const VitalSignSelector = ({ selectedType, onSelectType }: VitalSignSelectorProps) => {
  return (
    <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
      <Tabs value={selectedType} className="w-full">
        <TabsList variant="pills" size="sm" className="min-w-max">
          <TabsTrigger
            value="news2" 
            onClick={() => onSelectType('news2')}
            variant="pills"
            size="sm"
          >
            NEWS2 Score
          </TabsTrigger>
          <TabsTrigger
            value="temperature" 
            onClick={() => onSelectType('temperature')}
            variant="pills"
            size="sm"
          >
            Temperature
          </TabsTrigger>
          <TabsTrigger
            value="heartRate" 
            onClick={() => onSelectType('heartRate')}
            variant="pills"
            size="sm"
          >
            Heart Rate
          </TabsTrigger>
          <TabsTrigger 
            value="respiration" 
            onClick={() => onSelectType('respiration')}
            variant="pills"
            size="sm"
          >
            Respiration
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default VitalSignSelector;
