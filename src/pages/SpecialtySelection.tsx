
import SpecialtySelector from '@/components/SpecialtySelector';

const SpecialtySelection = () => {
  const specialties = [
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Oncology',
    'Orthopedics',
    'Psychiatry',
    'Pulmonology',
    'Rheumatology'
  ];

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
