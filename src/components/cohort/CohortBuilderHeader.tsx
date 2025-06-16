
interface CohortBuilderHeaderProps {
  selectedSpecialties: string[];
}

const CohortBuilderHeader = ({ selectedSpecialties }: CohortBuilderHeaderProps) => {
  const getDisplayText = () => {
    if (selectedSpecialties.length === 0) {
      return 'No specialties selected';
    } else if (selectedSpecialties.length === 1) {
      return selectedSpecialties[0];
    } else {
      return `${selectedSpecialties.length} specialties: ${selectedSpecialties.join(', ')}`;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Waiting List Manager</h1>
      <p className="text-muted-foreground">
        Managing waiting list for: <span className="font-medium text-foreground">{getDisplayText()}</span>
      </p>
    </div>
  );
};

export default CohortBuilderHeader;
