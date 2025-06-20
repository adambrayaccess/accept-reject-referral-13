
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReferralPriority } from "@/types/referral";
import { mockPractitioners } from "@/services/mock/practitioners";
import { services } from "@/data/serviceOptions";

interface ReferralBasicInfoFormProps {
  referralId: string;
  setReferralId: (value: string) => void;
  priority: ReferralPriority;
  setPriority: (value: ReferralPriority) => void;
  specialty: string;
  setSpecialty: (value: string) => void;
  practitionerId: string;
  setPractitionerId: (value: string) => void;
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
}: ReferralBasicInfoFormProps) => {
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
              {services.map((serviceOption) => (
                <SelectItem key={serviceOption.id} value={serviceOption.name}>
                  {serviceOption.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="practitioner">Referring Practitioner</Label>
          <Select value={practitionerId} onValueChange={(value: string) => setPractitionerId(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select practitioner" />
            </SelectTrigger>
            <SelectContent>
              {mockPractitioners.map((practitioner) => (
                <SelectItem key={practitioner.id} value={practitioner.id}>
                  {practitioner.name} - {practitioner.organization}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ReferralBasicInfoForm;
