
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SpecialtySelector from '@/components/SpecialtySelector';

interface AdminSpecialtySelectorProps {
  specialties: string[];
  currentSpecialty: string | null;
  onSpecialtySelect: (specialty: string) => void;
  onShowAll: () => void;
}

const AdminSpecialtySelector = ({ 
  specialties, 
  currentSpecialty, 
  onSpecialtySelect, 
  onShowAll 
}: AdminSpecialtySelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Specialty Filter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <SpecialtySelector
              specialties={['All Specialties', ...specialties]}
              onSpecialtySelect={(specialty) => {
                if (specialty === 'All Specialties') {
                  onShowAll();
                } else {
                  onSpecialtySelect(specialty);
                }
              }}
            />
          </div>
          {currentSpecialty && (
            <Button variant="outline" onClick={onShowAll}>
              Show All
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSpecialtySelector;
