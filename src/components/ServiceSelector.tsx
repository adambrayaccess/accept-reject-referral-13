
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ServiceMultiSelector from './ServiceMultiSelector';

interface ServiceSelectorProps {
  onServiceSelect?: (service: string) => void;
  services: string[];
  isStandalone?: boolean;
}

const ServiceSelector = ({ 
  onServiceSelect, 
  services,
  isStandalone = false 
}: ServiceSelectorProps) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleServiceChange = (servicesArray: string[]) => {
    setSelectedServices(servicesArray);
    
    if (onServiceSelect && servicesArray.length > 0) {
      // For backward compatibility, call with first selected service
      onServiceSelect(servicesArray[0]);
    }
  };

  const handleContinue = () => {
    // Store the selected services in local storage for persistence
    if (selectedServices.length > 0) {
      localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
      navigate('/');
    }
  };

  const filteredServices = services.filter(service => service !== 'all');

  return (
    <div className={`space-y-4 ${isStandalone ? 'p-6 max-w-md mx-auto mt-20 rounded-lg border shadow-md' : ''}`}>
      {isStandalone && (
        <h2 className="text-2xl font-bold text-center mb-6">Select Your Services</h2>
      )}
      
      <div className="space-y-2">
        <label htmlFor="service-select" className="block text-sm font-medium">
          Services for Triage
        </label>
        <ServiceMultiSelector
          services={filteredServices}
          selectedServices={selectedServices}
          onSelectionChange={handleServiceChange}
          placeholder="Select one or more services"
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          You will be shown referrals for the selected services only.
        </p>
      </div>

      {isStandalone && (
        <Button 
          onClick={handleContinue}
          disabled={selectedServices.length === 0}
          className="w-full mt-4"
        >
          Continue
        </Button>
      )}
    </div>
  );
};

export default ServiceSelector;
