
import { useState } from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

export type VitalSignType = 'news2' | 'temperature' | 'heartRate' | 'respiration';

interface VitalSignSelectorProps {
  selectedType: VitalSignType;
  onSelectType: (type: VitalSignType) => void;
}

const VitalSignSelector = ({ selectedType, onSelectType }: VitalSignSelectorProps) => {
  return (
    <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
      <TabsList className="bg-muted/50">
        <TabsTrigger 
          value="news2" 
          onClick={() => onSelectType('news2')}
          className={selectedType === 'news2' ? 'bg-background' : ''}
        >
          NEWS2 Score
        </TabsTrigger>
        <TabsTrigger 
          value="temperature" 
          onClick={() => onSelectType('temperature')}
          className={selectedType === 'temperature' ? 'bg-background' : ''}
        >
          Temperature
        </TabsTrigger>
        <TabsTrigger 
          value="heartRate" 
          onClick={() => onSelectType('heartRate')}
          className={selectedType === 'heartRate' ? 'bg-background' : ''}
        >
          Heart Rate
        </TabsTrigger>
        <TabsTrigger 
          value="respiration" 
          onClick={() => onSelectType('respiration')}
          className={selectedType === 'respiration' ? 'bg-background' : ''}
        >
          Respiration
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default VitalSignSelector;
