
import { Patient } from '@/types/patient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pill, MapPin, Phone, Mail } from 'lucide-react';

interface PharmacyDetailsCardProps {
  patient: Patient;
}

const PharmacyDetailsCard = ({ patient }: PharmacyDetailsCardProps) => {
  if (!patient.pharmacies || patient.pharmacies.length === 0) {
    return null;
  }

  const nominatedPharmacy = patient.pharmacies.find(p => p.type === 'nominated');
  const linkedPharmacies = patient.pharmacies.filter(p => p.type === 'linked');

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-green-500" />
          Pharmacy Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {nominatedPharmacy && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default" className="bg-green-600">
                Nominated Pharmacy
              </Badge>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">{nominatedPharmacy.name}</h4>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground" />
                <span>{nominatedPharmacy.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <span>{nominatedPharmacy.phone}</span>
              </div>
              {nominatedPharmacy.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span>{nominatedPharmacy.email}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {linkedPharmacies.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Linked Pharmacies</h4>
            <div className="space-y-3">
              {linkedPharmacies.map((pharmacy) => (
                <div key={pharmacy.id} className="p-3 border rounded-lg">
                  <div className="space-y-2">
                    <h5 className="font-medium">{pharmacy.name}</h5>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground" />
                      <span>{pharmacy.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{pharmacy.phone}</span>
                    </div>
                    {pharmacy.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span>{pharmacy.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PharmacyDetailsCard;
