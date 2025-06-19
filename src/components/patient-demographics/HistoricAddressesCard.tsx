
import { Patient } from '@/types/patient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface HistoricAddressesCardProps {
  patient: Patient;
}

const HistoricAddressesCard = ({ patient }: HistoricAddressesCardProps) => {
  if (!patient.historicAddresses || patient.historicAddresses.length === 0) {
    return null;
  }

  const getAddressTypeBadge = (type: string) => {
    switch (type) {
      case 'residential': return { label: 'Residential', variant: 'default' as const };
      case 'temporary': return { label: 'Temporary', variant: 'secondary' as const };
      case 'correspondence': return { label: 'Correspondence', variant: 'outline' as const };
      default: return { label: type, variant: 'outline' as const };
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-amber-500" />
          Address History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {patient.historicAddresses.map((address) => (
            <div key={address.id} className="p-3 border rounded-lg">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{address.address}</p>
                  </div>
                  <Badge {...getAddressTypeBadge(address.type)} className="ml-2">
                    {getAddressTypeBadge(address.type).label}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>From: {format(new Date(address.dateFrom), 'dd MMM yyyy')}</span>
                  </div>
                  {address.dateTo && (
                    <div className="flex items-center gap-1">
                      <span>To: {format(new Date(address.dateTo), 'dd MMM yyyy')}</span>
                    </div>
                  )}
                  {!address.dateTo && (
                    <Badge variant="outline" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricAddressesCard;
