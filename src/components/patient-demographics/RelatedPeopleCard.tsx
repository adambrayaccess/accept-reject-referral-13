
import { Patient } from '@/types/patient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Phone, Mail, MapPin } from 'lucide-react';

interface RelatedPeopleCardProps {
  patient: Patient;
}

const RelatedPeopleCard = ({ patient }: RelatedPeopleCardProps) => {
  if (!patient.relatedPeople || patient.relatedPeople.length === 0) {
    return null;
  }

  const getPersonBadges = (person: any) => {
    const badges = [];
    if (person.isPrimaryContact) badges.push({ label: 'Primary Contact', variant: 'default' as const });
    if (person.isNextOfKin) badges.push({ label: 'Next of Kin', variant: 'destructive' as const });
    if (person.isEmergencyContact) badges.push({ label: 'Emergency Contact', variant: 'secondary' as const });
    return badges;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-500" />
          Related People & Contacts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {patient.relatedPeople.map((person) => (
            <div key={person.id} className="p-3 border rounded-lg">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{person.name}</h4>
                    <p className="text-sm text-muted-foreground capitalize">{person.relationship}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {getPersonBadges(person).map((badge, index) => (
                      <Badge key={index} variant={badge.variant} className="text-xs">
                        {badge.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {person.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{person.phone}</span>
                    </div>
                  )}
                  {person.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span>{person.email}</span>
                    </div>
                  )}
                </div>
                
                {person.address && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground" />
                    <span>{person.address}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedPeopleCard;
