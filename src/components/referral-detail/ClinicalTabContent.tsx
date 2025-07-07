
import { useState, useEffect } from 'react';
import { Referral } from '@/types/referral';
import { fetchHCPById } from '@/services/hcpService';
import { Button } from '@/components/ui/button';
import { Stethoscope } from 'lucide-react';
import DiagnosisSheet from '@/components/diagnosis/DiagnosisSheet';

interface ClinicalTabContentProps {
  referral: Referral;
}

const ClinicalTabContent = ({ referral }: ClinicalTabContentProps) => {
  const [hcpName, setHcpName] = useState<string>('');
  const [isLoadingHCP, setIsLoadingHCP] = useState(false);
  const [isDiagnosisSheetOpen, setIsDiagnosisSheetOpen] = useState(false);

  useEffect(() => {
    const fetchHCPName = async () => {
      if (referral.assignedHCPId) {
        setIsLoadingHCP(true);
        try {
          const hcp = await fetchHCPById(referral.assignedHCPId);
          setHcpName(hcp?.name || referral.assignedHCPId);
        } catch (error) {
          console.error('Error fetching HCP:', error);
          setHcpName(referral.assignedHCPId);
        } finally {
          setIsLoadingHCP(false);
        }
      }
    };

    fetchHCPName();
  }, [referral.assignedHCPId]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-3 text-sm">
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
        
        {referral.clinicalInfo.diagnosis && (
          <div>
            <div className="text-xs font-medium text-muted-foreground">Provisional Diagnosis</div>
            <div className="mt-1 text-sm">{referral.clinicalInfo.diagnosis}</div>
          </div>
        )}
        
        {referral.clinicalInfo.notes && (
          <div>
            <div className="text-xs font-medium text-muted-foreground">Additional Notes</div>
            <div className="mt-1 text-sm whitespace-pre-line">{referral.clinicalInfo.notes}</div>
          </div>
        )}
        
        {referral.assignedHCPId && (
          <div>
            <div className="text-xs font-medium text-muted-foreground">HCP referred to</div>
            <div className="font-medium">
              {isLoadingHCP ? 'Loading...' : hcpName || referral.assignedHCPId}
            </div>
          </div>
        )}
        
        <div className="lg:col-span-2">
          <div className="text-xs font-medium text-muted-foreground">Reason for Referral</div>
          <div className="mt-1 text-sm">{referral.clinicalInfo.reason}</div>
        </div>
        
        {referral.clinicalInfo.history && (
          <div className="lg:col-span-2">
            <div className="text-xs font-medium text-muted-foreground">Clinical History</div>
            <div className="mt-1 text-sm whitespace-pre-line">{referral.clinicalInfo.history}</div>
          </div>
        )}
        
        {referral.clinicalInfo.medications && referral.clinicalInfo.medications.length > 0 && (
          <div className="lg:col-span-2">
            <div className="text-xs font-medium text-muted-foreground">Current Medications</div>
            <ul className="list-disc pl-4 mt-1 text-sm space-y-1">
              {referral.clinicalInfo.medications.map((med, index) => (
                <li key={index}>{med}</li>
              ))}
            </ul>
          </div>
        )}
        
        {referral.clinicalInfo.allergies && referral.clinicalInfo.allergies.length > 0 && (
          <div className="lg:col-span-2">
            <div className="text-xs font-medium text-muted-foreground">Allergies</div>
            <ul className="list-disc pl-4 mt-1 text-sm space-y-1">
              {referral.clinicalInfo.allergies.map((allergy, index) => (
                <li key={index}>{allergy}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* View Diagnoses Button */}
      <div className="mt-6 flex justify-start">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDiagnosisSheetOpen(true)}
          className="flex items-center gap-2"
        >
          <Stethoscope className="h-4 w-4" />
          View Diagnoses
        </Button>
      </div>

      {/* Diagnosis Sheet */}
      <DiagnosisSheet
        isOpen={isDiagnosisSheetOpen}
        onClose={() => setIsDiagnosisSheetOpen(false)}
        patientId={referral.patient.id}
        patientName={referral.patient.name}
      />
    </>
  );
};

export default ClinicalTabContent;
