import { Referral } from '@/types/referral';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface EditableReferrerTabContentProps {
  referral: Referral;
  editData: any;
  setEditData: (data: any) => void;
}

const EditableReferrerTabContent = ({ referral, editData, setEditData }: EditableReferrerTabContentProps) => {
  const handleFieldChange = (field: string, value: string) => {
    setEditData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-4">
      {/* Read-only fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
        <div>
          <div className="text-xs font-medium text-muted-foreground">Referrer Name (Read-only)</div>
          <div className="font-medium text-sm">{referral.referrer.name}</div>
        </div>
        
        {referral.referrer.role && (
          <div>
            <div className="text-xs font-medium text-muted-foreground">Role (Read-only)</div>
            <div className="font-medium text-sm">{referral.referrer.role}</div>
          </div>
        )}
        
        {referral.referrer.organization && (
          <div>
            <div className="text-xs font-medium text-muted-foreground">Referral Organisation (Read-only)</div>
            <div className="font-medium text-sm">{referral.referrer.organization}</div>
          </div>
        )}
        
        {referral.referrer.contact && (
          <div>
            <div className="text-xs font-medium text-muted-foreground">Contact (Read-only)</div>
            <div className="font-medium text-sm">{referral.referrer.contact}</div>
          </div>
        )}
        
        <div>
          <div className="text-xs font-medium text-muted-foreground">Date Referred (Read-only)</div>
          <div className="font-medium text-sm">{format(new Date(referral.created), 'dd MMM yyyy, HH:mm')}</div>
        </div>
      </div>

      {/* Editable fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="referralSource" className="text-xs font-medium text-muted-foreground">
            Referral Source
          </Label>
          <Input
            id="referralSource"
            value={editData.referralSource}
            onChange={(e) => handleFieldChange('referralSource', e.target.value)}
            className="mt-1"
            placeholder="Optional"
          />
        </div>
        
        <div>
          <Label htmlFor="referralType" className="text-xs font-medium text-muted-foreground">
            Referral Type
          </Label>
          <Select
            value={editData.referralType}
            onValueChange={(value) => handleFieldChange('referralType', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select referral type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              <SelectItem value="External Referral">External Referral</SelectItem>
              <SelectItem value="Internal Referral">Internal Referral</SelectItem>
              <SelectItem value="Self Referral">Self Referral</SelectItem>
              <SelectItem value="Emergency Referral">Emergency Referral</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="patientAreaCareSetting" className="text-xs font-medium text-muted-foreground">
            Patient Area/Care Setting
          </Label>
          <Input
            id="patientAreaCareSetting"
            value={editData.patientAreaCareSetting}
            onChange={(e) => handleFieldChange('patientAreaCareSetting', e.target.value)}
            className="mt-1"
            placeholder="Optional"
          />
        </div>
        
        <div>
          <Label htmlFor="externalReference" className="text-xs font-medium text-muted-foreground">
            External Reference
          </Label>
          <Input
            id="externalReference"
            value={editData.externalReference}
            onChange={(e) => handleFieldChange('externalReference', e.target.value)}
            className="mt-1"
            placeholder="Optional"
          />
        </div>
        
        <div>
          <Label htmlFor="camhsServiceTier" className="text-xs font-medium text-muted-foreground">
            CAMHS Service Tier
          </Label>
          <Select
            value={editData.camhsServiceTier}
            onValueChange={(value) => handleFieldChange('camhsServiceTier', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select CAMHS tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              <SelectItem value="Tier 1">Tier 1</SelectItem>
              <SelectItem value="Tier 2">Tier 2</SelectItem>
              <SelectItem value="Tier 3">Tier 3</SelectItem>
              <SelectItem value="Tier 4">Tier 4</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default EditableReferrerTabContent;