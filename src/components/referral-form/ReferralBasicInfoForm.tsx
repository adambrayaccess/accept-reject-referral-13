
import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReferralPriority, FhirPractitioner } from "@/types/referral";
import { fetchPractitioners } from "@/services/practitionerService";
import { useSpecialtyData } from "@/hooks/useSpecialtyData";

interface ReferralBasicInfoFormProps {
  referralId: string;
  setReferralId: (value: string) => void;
  priority: ReferralPriority;
  setPriority: (value: ReferralPriority) => void;
  specialty: string;
  setSpecialty: (value: string) => void;
  practitionerId: string;
  setPractitionerId: (value: string) => void;
  referralType: string;
  setReferralType: (value: string) => void;
}

const ReferralBasicInfoForm = ({
  referralId,
  setReferralId,
  priority,
  setPriority,
  specialty,
  setSpecialty,
  practitionerId,
  setPractitionerId,
  referralType,
  setReferralType,
}: ReferralBasicInfoFormProps) => {
  const [practitioners, setPractitioners] = useState<FhirPractitioner[]>([]);
  const [isLoadingPractitioners, setIsLoadingPractitioners] = useState(true);
  const { specialties } = useSpecialtyData();

  useEffect(() => {
    const loadPractitioners = async () => {
      setIsLoadingPractitioners(true);
      try {
        const practitionerData = await fetchPractitioners();
        setPractitioners(practitionerData);
      } catch (error) {
        console.error('Error loading practitioners:', error);
      } finally {
        setIsLoadingPractitioners(false);
      }
    };

    loadPractitioners();
  }, []);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="referralId">Referral ID</Label>
          <Input
            id="referralId"
            value={referralId}
            onChange={(e) => setReferralId(e.target.value)}
            placeholder="Auto-generated"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={(value: ReferralPriority) => setPriority(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="routine">Routine</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="specialty">Service</Label>
          <Select value={specialty} onValueChange={(value: string) => setSpecialty(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialtyOption) => (
                <SelectItem key={specialtyOption.id} value={specialtyOption.name}>
                  {specialtyOption.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="practitioner">Referring Practitioner</Label>
          <Select value={practitionerId} onValueChange={(value: string) => setPractitionerId(value)}>
            <SelectTrigger>
              <SelectValue placeholder={isLoadingPractitioners ? "Loading practitioners..." : "Select practitioner"} />
            </SelectTrigger>
            <SelectContent>
              {practitioners.map((practitioner) => (
                <SelectItem key={practitioner.id} value={practitioner.id}>
                  {practitioner.name} - {practitioner.organization}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="referralType">Referral Type</Label>
          <Select value={referralType} onValueChange={(value: string) => setReferralType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select referral type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="External Referral">External Referral</SelectItem>
              <SelectItem value="Internal Referral">Internal Referral</SelectItem>
              <SelectItem value="Self Referral">Self Referral</SelectItem>
              <SelectItem value="Emergency Referral">Emergency Referral</SelectItem>
              <SelectItem value="Routine Referral">Routine Referral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ReferralBasicInfoForm;
