import { Referral } from '@/types/referral';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface EditablePatientTabContentProps {
  referral: Referral;
  relatedReferrals: {
    serviceTotal: number;
    activeTotal: number;
    activeSpecialties: string[];
  };
  editData: any;
  setEditData: (data: any) => void;
}

const EditablePatientTabContent = ({ referral, relatedReferrals, editData, setEditData }: EditablePatientTabContentProps) => {
  const handleFieldChange = (field: string, value: string) => {
    setEditData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-4">
      {/* Read-only patient information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
        <div>
          <div className="text-xs font-medium text-muted-foreground">Full Name (Read-only)</div>
          <div className="font-medium flex items-center gap-2 flex-wrap text-sm">
            {referral.patient.name}
            {referral.patient.pronouns && (
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                {referral.patient.pronouns}
              </Badge>
            )}
          </div>
        </div>
        
        <div>
          <div className="text-xs font-medium text-muted-foreground">NHS Number (Read-only)</div>
          <div className="font-mono font-medium text-sm">{referral.patient.nhsNumber}</div>
        </div>
        
        <div>
          <div className="text-xs font-medium text-muted-foreground">Date of Birth (Read-only)</div>
          <div className="font-medium text-sm">
            {format(new Date(referral.patient.birthDate), 'dd MMM yyyy')}
            {' '}
            ({new Date().getFullYear() - new Date(referral.patient.birthDate).getFullYear()} years)
          </div>
        </div>
        
        <div>
          <div className="text-xs font-medium text-muted-foreground">Gender (Read-only)</div>
          <div className="font-medium text-sm">{referral.patient.gender.charAt(0).toUpperCase() + referral.patient.gender.slice(1)}</div>
        </div>
        
        {referral.patient.address && (
          <div>
            <div className="text-xs font-medium text-muted-foreground">Address (Read-only)</div>
            <div className="font-medium text-sm">{referral.patient.address}</div>
          </div>
        )}
        
        {referral.patient.phone && (
          <div>
            <div className="text-xs font-medium text-muted-foreground">Contact Number (Read-only)</div>
            <div className="font-medium text-sm">{referral.patient.phone}</div>
          </div>
        )}
      </div>

      {/* Editable fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="overseasStatus" className="text-xs font-medium text-muted-foreground">
            Overseas Status
          </Label>
          <Select
            value={editData.overseasStatus}
            onValueChange={(value) => handleFieldChange('overseasStatus', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select overseas status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              <SelectItem value="UK Resident">UK Resident</SelectItem>
              <SelectItem value="Overseas Visitor">Overseas Visitor</SelectItem>
              <SelectItem value="EEA National">EEA National</SelectItem>
              <SelectItem value="Refugee">Refugee</SelectItem>
              <SelectItem value="Asylum Seeker">Asylum Seeker</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="administrativeCategory" className="text-xs font-medium text-muted-foreground">
            Administrative Category
          </Label>
          <Select
            value={editData.administrativeCategory}
            onValueChange={(value) => handleFieldChange('administrativeCategory', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select administrative category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              <SelectItem value="NHS Patient">NHS Patient</SelectItem>
              <SelectItem value="Private Patient">Private Patient</SelectItem>
              <SelectItem value="Armed Forces">Armed Forces</SelectItem>
              <SelectItem value="Student">Student</SelectItem>
              <SelectItem value="Overseas Visitor">Overseas Visitor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Related referrals (read-only) */}
      <div className="flex flex-col gap-3 p-3 bg-muted rounded-lg">
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
  );
};

export default EditablePatientTabContent;