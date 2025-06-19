
import { Referral } from '@/types/referral';
import { Separator } from '@/components/ui/separator';

interface ClinicalTabContentProps {
  referral: Referral;
}

const ClinicalTabContent = ({ referral }: ClinicalTabContentProps) => {
  return (
    <div className="text-sm space-y-3">
      <div>
        <div className="text-xs font-medium text-muted-foreground">Specialty</div>
        <div className="font-medium">{referral.specialty}</div>
      </div>
      
      {referral.service && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">Service</div>
          <div className="font-medium">{referral.service}</div>
        </div>
      )}
      
      <Separator />
      
      <div>
        <div className="text-xs font-medium text-muted-foreground">Reason for Referral</div>
        <div className="mt-1 text-sm">{referral.clinicalInfo.reason}</div>
      </div>
      
      {referral.clinicalInfo.history && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">Clinical History</div>
          <div className="mt-1 text-sm whitespace-pre-line">{referral.clinicalInfo.history}</div>
        </div>
      )}
      
      {referral.clinicalInfo.diagnosis && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">Provisional Diagnosis</div>
          <div className="mt-1 text-sm">{referral.clinicalInfo.diagnosis}</div>
        </div>
      )}
      
      {referral.clinicalInfo.medications && referral.clinicalInfo.medications.length > 0 && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">Current Medications</div>
          <ul className="list-disc pl-4 mt-1 text-sm space-y-1">
            {referral.clinicalInfo.medications.map((med, index) => (
              <li key={index}>{med}</li>
            ))}
          </ul>
        </div>
      )}
      
      {referral.clinicalInfo.allergies && referral.clinicalInfo.allergies.length > 0 && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">Allergies</div>
          <ul className="list-disc pl-4 mt-1 text-sm space-y-1">
            {referral.clinicalInfo.allergies.map((allergy, index) => (
              <li key={index}>{allergy}</li>
            ))}
          </ul>
        </div>
      )}
      
      {referral.clinicalInfo.notes && (
        <div>
          <div className="text-xs font-medium text-muted-foreground">Additional Notes</div>
          <div className="mt-1 text-sm whitespace-pre-line">{referral.clinicalInfo.notes}</div>
        </div>
      )}
    </div>
  );
};

export default ClinicalTabContent;
