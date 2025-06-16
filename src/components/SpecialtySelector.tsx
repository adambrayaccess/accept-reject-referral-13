
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import SpecialtyMultiSelector from './SpecialtyMultiSelector';

interface SpecialtySelectorProps {
  onSpecialtySelect?: (specialty: string) => void;
  specialties: string[];
  isStandalone?: boolean;
}

const SpecialtySelector = ({ 
  onSpecialtySelect, 
  specialties,
  isStandalone = false 
}: SpecialtySelectorProps) => {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSpecialtyChange = (specialtiesArray: string[]) => {
    setSelectedSpecialties(specialtiesArray);
    
    if (onSpecialtySelect && specialtiesArray.length > 0) {
      // For backward compatibility, call with first selected specialty
      onSpecialtySelect(specialtiesArray[0]);
    }
  };

  const handleContinue = () => {
    // Store the selected specialties in local storage for persistence
    if (selectedSpecialties.length > 0) {
      localStorage.setItem('selectedSpecialties', JSON.stringify(selectedSpecialties));
      navigate('/');
    }
  };

  const filteredSpecialties = specialties.filter(specialty => specialty !== 'all');

  return (
    <div className={`space-y-4 ${isStandalone ? 'p-6 max-w-md mx-auto mt-20 rounded-lg border shadow-md' : ''}`}>
      {isStandalone && (
        <h2 className="text-2xl font-bold text-center mb-6">Select Your Specialties</h2>
      )}
      
      <div className="space-y-2">
        <label htmlFor="specialty-select" className="block text-sm font-medium">
          Specialties for Triage
        </label>
        <SpecialtyMultiSelector
          specialties={filteredSpecialties}
          selectedSpecialties={selectedSpecialties}
          onSelectionChange={handleSpecialtyChange}
          placeholder="Select one or more specialties"
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          You will be shown referrals for the selected specialties only.
        </p>
      </div>

      {isStandalone && (
        <Button 
          onClick={handleContinue}
          disabled={selectedSpecialties.length === 0}
          className="w-full mt-4"
        >
          Continue
        </Button>
      )}
    </div>
  );
};

export default SpecialtySelector;
