
import { useState } from 'react';
import { Referral } from '@/types/referral';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import PatientDemographicsButton from '@/components/patient-demographics/PatientDemographicsButton';
import PatientDemographicsSheet from '@/components/patient-demographics/PatientDemographicsSheet';

interface PatientTabContentProps {
  referral: Referral;
  relatedReferrals: {
    serviceTotal: number;
    activeTotal: number;
    activeSpecialties: string[];
  };
}

const PatientTabContent = ({ referral, relatedReferrals }: PatientTabContentProps) => {
  const [isDemographicsOpen, setIsDemographicsOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-3 text-sm">
      <div>
        <div className="text-xs font-medium text-muted-foreground">Full Name</div>
        <div className="font-medium">{referral.patient.name}</div>
      </div>
      
      <div>
        <div className="text-xs font-medium text-muted-foreground">NHS Number</div>
        <div className="font-mono font-medium">{referral.patient.nhsNumber}</div>
      </div>
      
      <div>
        <div className="text-xs font-medium text-muted-foreground">Date of Birth</div>
        <div className="font-medium">
          {format(new Date(referral.patient.birthDate), 'dd MMM yyyy')}
          {' '}
          ({new Date().getFullYear() - new Date(referral.patient.birthDate).getFullYear()} years)
        </div>
      </div>
      
      <div>
        <div className="text-xs font-medium text-muted-foreground">Gender</div>
        <div className="font-medium">{referral.patient.gender.charAt(0).toUpperCase() + referral.patient.gender.slice(1)}</div>
      </div>
      
      {referral.patient.address && (
        <div className="col-span-1 lg:col-span-2">
          <div className="text-xs font-medium text-muted-foreground">Address</div>
          <div className="font-medium">{referral.patient.address}</div>
        </div>
      )}
      
      {referral.patient.phone && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">Contact Number</div>
          <div className="font-medium">{referral.patient.phone}</div>
        </div>
      )}
      
      {/* Demographics Button */}
      <div className="col-span-1 lg:col-span-2 mt-3">
        <PatientDemographicsButton onClick={() => setIsDemographicsOpen(true)} />
      </div>
      
      <div className="col-span-1 lg:col-span-2">
        <div className="flex flex-col gap-3 p-3 bg-muted rounded-lg mt-2">
          <div className="flex gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Other referrals to {referral.specialty}</div>
              <div className="text-xl font-bold">{relatedReferrals.serviceTotal}</div>
            </div>
            <Separator orientation="vertical" className="h-auto" />
            <div>
              <div className="text-xs text-muted-foreground">Active referrals</div>
              <div className="text-xl font-bold">{relatedReferrals.activeTotal}</div>
            </div>
          </div>
          {relatedReferrals.activeSpecialties && relatedReferrals.activeSpecialties.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="text-xs text-muted-foreground mb-1">Active referral specialties:</div>
                <div className="flex flex-wrap gap-1">
                  {relatedReferrals.activeSpecialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">{specialty}</Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Demographics Sheet */}
      <PatientDemographicsSheet
        patient={referral.patient}
        isOpen={isDemographicsOpen}
        onOpenChange={setIsDemographicsOpen}
      />
    </div>
  );
};

export default PatientTabContent;
