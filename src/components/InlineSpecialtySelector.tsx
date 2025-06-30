
import React from 'react';
import SpecialtyMultiSelector from './SpecialtyMultiSelector';

interface InlineSpecialtySelectorProps {
  specialties: string[];
  selectedSpecialties: string[];
  onSelectionChange: (specialties: string[]) => void;
  className?: string;
}

const InlineSpecialtySelector = ({
  specialties,
  selectedSpecialties,
  onSelectionChange,
  className = ""
}: InlineSpecialtySelectorProps) => {
  return (
    <div className={`inline-flex ${className}`}>
      <SpecialtyMultiSelector
        specialties={specialties}
        selectedSpecialties={selectedSpecialties}
        onSelectionChange={onSelectionChange}
        placeholder="Select services"
        className="min-w-64"
      />
    </div>
  );
};

export default InlineSpecialtySelector;
