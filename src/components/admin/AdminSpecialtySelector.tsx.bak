
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllSpecialtyNames } from '@/data/specialtyOptions';

interface AdminSpecialtySelectorProps {
  currentSpecialty: string | null;
  onSpecialtySelect: (specialty: string) => void;
  onShowAll: () => void;
}

const AdminSpecialtySelector = ({ 
  currentSpecialty, 
  onSpecialtySelect, 
  onShowAll 
}: AdminSpecialtySelectorProps) => {
  // Use centralized specialty data
  const specialties = getAllSpecialtyNames();

  const handleSpecialtyChange = (value: string) => {
    if (value === 'all') {
      onShowAll();
    } else {
      onSpecialtySelect(value);
    }
  };

  const getCurrentValue = () => {
    if (!currentSpecialty) return 'all';
    return currentSpecialty;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Filter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Select value={getCurrentValue()} onValueChange={handleSpecialtyChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
