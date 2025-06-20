
import ServiceSelector from '@/components/ServiceSelector';
import { getAllServiceNames } from '@/data/serviceOptions';

const ServiceSelection = () => {
  // Use centralized service data instead of hardcoded list
  const services = getAllServiceNames();

  return (
    <div className="container mx-auto">
      <ServiceSelector 
        services={services} 
        isStandalone={true} 
      />
    </div>
  );
};

export default ServiceSelection;
