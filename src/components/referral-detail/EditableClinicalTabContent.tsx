import { useState, useEffect } from 'react';
import { Referral } from '@/types/referral';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchHCPById } from '@/services/hcpService';

interface EditableClinicalTabContentProps {
  referral: Referral;
  editData: any;
  setEditData: (data: any) => void;
}

const EditableClinicalTabContent = ({ referral, editData, setEditData }: EditableClinicalTabContentProps) => {
  const [hcpName, setHcpName] = useState<string>('');
  const [isLoadingHCP, setIsLoadingHCP] = useState(false);

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

  const handleFieldChange = (field: string, value: string) => {
    setEditData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="specialty" className="text-xs font-medium text-muted-foreground">
            Specialty
          </Label>
          <Input
            id="specialty"
            value={editData.specialty}
            onChange={(e) => handleFieldChange('specialty', e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="service" className="text-xs font-medium text-muted-foreground">
            Service
          </Label>
          <Input
            id="service"
            value={editData.service}
            onChange={(e) => handleFieldChange('service', e.target.value)}
            className="mt-1"
            placeholder="Optional"
          />
        </div>
        
        <div className="lg:col-span-2">
          <Label htmlFor="assignedHCPId" className="text-xs font-medium text-muted-foreground">
            HCP referred to (ID)
          </Label>
          <Input
            id="assignedHCPId"
            value={editData.assignedHCPId}
            onChange={(e) => handleFieldChange('assignedHCPId', e.target.value)}
            className="mt-1"
            placeholder="Optional"
          />
          {referral.assignedHCPId && (
            <p className="text-xs text-muted-foreground mt-1">
              Current: {isLoadingHCP ? 'Loading...' : hcpName || referral.assignedHCPId}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="reason" className="text-xs font-medium text-muted-foreground">
          Reason for Referral *
        </Label>
        <Textarea
          id="reason"
          value={editData.reason}
          onChange={(e) => handleFieldChange('reason', e.target.value)}
          className="mt-1"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="history" className="text-xs font-medium text-muted-foreground">
          Clinical History
        </Label>
        <Textarea
          id="history"
          value={editData.history}
          onChange={(e) => handleFieldChange('history', e.target.value)}
          className="mt-1"
          rows={4}
          placeholder="Optional"
        />
      </div>

      <div>
        <Label htmlFor="diagnosis" className="text-xs font-medium text-muted-foreground">
          Provisional Diagnosis
        </Label>
        <Textarea
          id="diagnosis"
          value={editData.diagnosis}
          onChange={(e) => handleFieldChange('diagnosis', e.target.value)}
          className="mt-1"
          rows={2}
          placeholder="Optional"
        />
      </div>

      <div>
        <Label htmlFor="medications" className="text-xs font-medium text-muted-foreground">
          Current Medications (one per line)
        </Label>
        <Textarea
          id="medications"
          value={editData.medications}
          onChange={(e) => handleFieldChange('medications', e.target.value)}
          className="mt-1"
          rows={4}
          placeholder="Optional - one medication per line"
        />
      </div>

      <div>
        <Label htmlFor="allergies_info" className="text-xs font-medium text-muted-foreground">
          Allergies (one per line)
        </Label>
        <Textarea
          id="allergies_info"
          value={editData.allergies_info}
          onChange={(e) => handleFieldChange('allergies_info', e.target.value)}
          className="mt-1"
          rows={3}
          placeholder="Optional - one allergy per line"
        />
      </div>

      <div>
        <Label htmlFor="notes" className="text-xs font-medium text-muted-foreground">
          Additional Notes
        </Label>
        <Textarea
          id="notes"
          value={editData.notes}
          onChange={(e) => handleFieldChange('notes', e.target.value)}
          className="mt-1"
          rows={4}
          placeholder="Optional"
        />
      </div>
    </div>
  );
};

export default EditableClinicalTabContent;