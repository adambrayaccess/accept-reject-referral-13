
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const navigate = useNavigate();

  const handleSpecialtyChange = (value: string) => {
    setSelectedSpecialty(value);
    
    if (onSpecialtySelect) {
      onSpecialtySelect(value);
    }
  };

  const handleContinue = () => {
    // Store the selected specialty in local storage for persistence
    if (selectedSpecialty) {
      localStorage.setItem('selectedSpecialty', selectedSpecialty);
      navigate('/');
    }
  };

  const filteredSpecialties = specialties.filter(specialty => specialty !== 'all');

  return (
    <div className={`space-y-4 ${isStandalone ? 'p-6 max-w-md mx-auto mt-20 rounded-lg border shadow-md' : ''}`}>
      {isStandalone && (
        <h2 className="text-2xl font-bold text-center mb-6">Select Your Specialty</h2>
      )}
      
      <div className="space-y-2">
        <label htmlFor="specialty-select" className="block text-sm font-medium">
          Specialty for Triage
        </label>
        <Select value={selectedSpecialty} onValueChange={handleSpecialtyChange}>
          <SelectTrigger id="specialty-select" className="w-full">
            <SelectValue placeholder="Select specialty" />
          </SelectTrigger>
          <SelectContent>
            {filteredSpecialties.map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          You will be shown referrals for this specialty only.
        </p>
      </div>

      {isStandalone && (
        <Button 
          onClick={handleContinue}
          disabled={!selectedSpecialty}
          className="w-full mt-4"
        >
          Continue
        </Button>
      )}
    </div>
  );
};

export default SpecialtySelector;
