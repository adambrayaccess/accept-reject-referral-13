
import { useState } from 'react';
import { EnhancedTabsList, EnhancedTabsTrigger } from '@/components/ui/enhanced-tabs';

export type VitalSignType = 'news2' | 'temperature' | 'heartRate' | 'respiration';

interface VitalSignSelectorProps {
  selectedType: VitalSignType;
  onSelectType: (type: VitalSignType) => void;
}

const VitalSignSelector = ({ selectedType, onSelectType }: VitalSignSelectorProps) => {
  return (
    <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
      <EnhancedTabsList variant="pills" size="sm" className="min-w-max">
        <EnhancedTabsTrigger 
          value="news2" 
          onClick={() => onSelectType('news2')}
          variant="pills"
          size="sm"
          className={selectedType === 'news2' ? 'bg-primary text-primary-foreground' : ''}
        >
          NEWS2 Score
        </EnhancedTabsTrigger>
        <EnhancedTabsTrigger 
          value="temperature" 
          onClick={() => onSelectType('temperature')}
          variant="pills"
          size="sm"
          className={selectedType === 'temperature' ? 'bg-primary text-primary-foreground' : ''}
        >
          Temperature
        </EnhancedTabsTrigger>
        <EnhancedTabsTrigger 
          value="heartRate" 
          onClick={() => onSelectType('heartRate')}
          variant="pills"
          size="sm"
          className={selectedType === 'heartRate' ? 'bg-primary text-primary-foreground' : ''}
        >
          Heart Rate
        </EnhancedTabsTrigger>
        <EnhancedTabsTrigger 
          value="respiration" 
          onClick={() => onSelectType('respiration')}
          variant="pills"
          size="sm"
          className={selectedType === 'respiration' ? 'bg-primary text-primary-foreground' : ''}
        >
          Respiration
        </EnhancedTabsTrigger>
      </EnhancedTabsList>
    </div>
  );
};

export default VitalSignSelector;
