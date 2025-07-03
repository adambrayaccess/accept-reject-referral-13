
import SpecialtySelector from '@/components/SpecialtySelector';
import { useSpecialtyData } from '@/hooks/useSpecialtyData';

const SpecialtySelection = () => {
  // Use database specialty data
  const { getSpecialtyNames } = useSpecialtyData();
  const specialties = getSpecialtyNames();

  return (
    <div className="container mx-auto">
      <SpecialtySelector 
        specialties={specialties} 
        isStandalone={true} 
      />
    </div>
  );
};

export default SpecialtySelection;
