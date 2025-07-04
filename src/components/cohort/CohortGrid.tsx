
import { Referral } from '@/types/referral';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { differenceInDays } from 'date-fns';
import { MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReferralPriorityBadge from '@/components/dashboard/ReferralPriorityBadge';

interface CohortGridProps {
  referrals: Referral[];
  isLoading: boolean;
  selectedReferrals: Referral[];
  onSelectReferral: (referral: Referral) => void;
  showTagsOnly?: boolean;
}

const CohortGrid = ({ 
  referrals, 
  isLoading, 
  selectedReferrals,
  onSelectReferral,
  showTagsOnly = false 
}: CohortGridProps) => {
  const navigate = useNavigate();
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-64 rounded-lg border border-border bg-card animate-pulse" />
        ))}
      </div>
    );
  }

  if (referrals.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          {showTagsOnly ? 
            'No tagged referrals found.' : 
            'No referrals match your filter criteria.'}
        </p>
      </div>
    );
  }

  const calculateReferralAgeDays = (created: string) => {
    return differenceInDays(new Date(), new Date(created));
  };

  const calculatePatientAge = (birthDate: string) => {
    return Math.floor(differenceInDays(new Date(), new Date(birthDate)) / 365);
  };

  const getLocationFromAddress = (address?: string) => {
    if (!address) return 'Unknown';
    const parts = address.split(',');
    return parts.pop()?.trim() || 'Unknown';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
      {referrals.map((referral) => {
        const isSelected = selectedReferrals.some(r => r.id === referral.id);
        const referralAge = calculateReferralAgeDays(referral.created);
        const patientAge = calculatePatientAge(referral.patient.birthDate);
        const location = getLocationFromAddress(referral.patient.address);
        const tags = referral.tags || [];

        return (
          <Card 
            key={referral.id} 
            className={`overflow-hidden transition-shadow hover:shadow-md cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`}
            onClick={() => navigate(`/waiting-list/referral/${referral.id}`)}
          >
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <Checkbox 
                    checked={isSelected}
                    onCheckedChange={() => onSelectReferral(referral)}
                    onClick={(e) => e.stopPropagation()}
                    id={`select-${referral.id}`}
                  />
                  <div>
                    <h3 className="font-medium">{referral.patient.name}</h3>
                    <p className="text-sm text-muted-foreground">NHS: {referral.patient.nhsNumber}</p>
                  </div>
                </div>
                <ReferralPriorityBadge priority={referral.priority} />
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Referral age: <strong>{referralAge} days</strong></span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Patient age: <strong>{patientAge} years</strong></span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Location: <strong>{location}</strong></span>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CohortGrid;
