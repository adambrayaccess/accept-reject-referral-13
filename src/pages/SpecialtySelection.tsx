
import SpecialtySelector from '@/components/SpecialtySelector';
import { getAllSpecialtyNames } from '@/data/specialtyOptions';

const SpecialtySelection = () => {
  // Use centralized specialty data instead of hardcoded list
  const specialties = getAllSpecialtyNames();

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
