
import { useState } from 'react';
import { Referral } from '@/types/referral';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnhancedTabs, EnhancedTabsContent, EnhancedTabsList, EnhancedTabsTrigger } from '@/components/ui/enhanced-tabs';
import { Badge } from '@/components/ui/badge';
import { Pencil, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReferralPriorityBadge from '@/components/dashboard/ReferralPriorityBadge';
import RTTPathwayTabContent from '@/components/referral-detail/RTTPathwayTabContent';
import PatientTabContent from '@/components/referral-detail/PatientTabContent';
import ClinicalTabContent from '@/components/referral-detail/ClinicalTabContent';
import ReferrerTabContent from '@/components/referral-detail/ReferrerTabContent';
import EditableClinicalTabContent from '@/components/referral-detail/EditableClinicalTabContent';
import EditableReferrerTabContent from '@/components/referral-detail/EditableReferrerTabContent';
import EditablePatientTabContent from '@/components/referral-detail/EditablePatientTabContent';
import { updateReferralDetails } from '@/services/referralService';

interface ReferralDetailProps {
  referral: Referral;
  relatedReferrals: {
    serviceTotal: number;
    activeTotal: number;
    activeSpecialties: string[];
  };
  onUpdate?: () => void;
}

const ReferralDetail = ({ referral, relatedReferrals, onUpdate }: ReferralDetailProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    // Clinical fields
    specialty: referral.specialty,
    service: referral.service || '',
    assignedHCPId: referral.assignedHCPId || '',
    reason: referral.clinicalInfo.reason,
    history: referral.clinicalInfo.history || '',
    diagnosis: referral.clinicalInfo.diagnosis || '',
    medications: referral.clinicalInfo.medications?.join('\n') || '',
    allergies_info: referral.clinicalInfo.allergies?.join('\n') || '',
    notes: referral.clinicalInfo.notes || '',
    // Referrer fields
    referralSource: referral.referralSource || '',
    referralType: referral.referralType || '',
    patientAreaCareSetting: referral.patientAreaCareSetting || '',
    externalReference: referral.externalReference || '',
    camhsServiceTier: referral.camhsServiceTier || '',
    // Patient fields
    overseasStatus: referral.overseasStatus || '',
    administrativeCategory: referral.administrativeCategory || '',
  });

  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset edit data to original values
    setEditData({
      specialty: referral.specialty,
      service: referral.service || '',
      assignedHCPId: referral.assignedHCPId || '',
      reason: referral.clinicalInfo.reason,
      history: referral.clinicalInfo.history || '',
      diagnosis: referral.clinicalInfo.diagnosis || '',
      medications: referral.clinicalInfo.medications?.join('\n') || '',
      allergies_info: referral.clinicalInfo.allergies?.join('\n') || '',
      notes: referral.clinicalInfo.notes || '',
      referralSource: referral.referralSource || '',
      referralType: referral.referralType || '',
      patientAreaCareSetting: referral.patientAreaCareSetting || '',
      externalReference: referral.externalReference || '',
      camhsServiceTier: referral.camhsServiceTier || '',
      overseasStatus: referral.overseasStatus || '',
      administrativeCategory: referral.administrativeCategory || '',
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await updateReferralDetails(referral.id, editData);
      
      if (success) {
        toast({
          title: "Success",
          description: "Referral details updated successfully",
        });
        setIsEditing(false);
        onUpdate?.();
      } else {
        toast({
          title: "Error",
          description: "Failed to update referral details",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving referral details:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Referral Details</CardTitle>
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="h-6 w-6 p-0"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="h-6 w-6 p-0"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <ReferralPriorityBadge priority={referral.priority} size="sm" />
            <Badge variant="outline" className="text-xs">
              {`Ref: ${referral.id}`}
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              {`UBRN: ${referral.ubrn}`}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <EnhancedTabs defaultValue="patient">
          <div className="mb-3">
            <EnhancedTabsList variant="grid" size="md">
              <EnhancedTabsTrigger value="patient" variant="grid" size="md">
                Patient
              </EnhancedTabsTrigger>
              <EnhancedTabsTrigger value="clinical" variant="grid" size="md">
                Clinical
              </EnhancedTabsTrigger>
              <EnhancedTabsTrigger value="referrer" variant="grid" size="md">
                Referrer
              </EnhancedTabsTrigger>
              <EnhancedTabsTrigger value="rtt-pathway" variant="grid" size="md">
                RTT/Pathway
              </EnhancedTabsTrigger>
            </EnhancedTabsList>
          </div>
          
          <EnhancedTabsContent value="patient" className="space-y-3">
            {isEditing ? (
              <EditablePatientTabContent 
                referral={referral} 
                relatedReferrals={relatedReferrals}
                editData={editData}
                setEditData={setEditData}
              />
            ) : (
              <PatientTabContent referral={referral} relatedReferrals={relatedReferrals} />
            )}
          </EnhancedTabsContent>
          
          <EnhancedTabsContent value="clinical" className="space-y-3">
            {isEditing ? (
              <EditableClinicalTabContent 
                referral={referral}
                editData={editData}
                setEditData={setEditData}
              />
            ) : (
              <ClinicalTabContent referral={referral} />
            )}
          </EnhancedTabsContent>
          
          <EnhancedTabsContent value="referrer" className="space-y-3">
            {isEditing ? (
              <EditableReferrerTabContent 
                referral={referral}
                editData={editData}
                setEditData={setEditData}
              />
            ) : (
              <ReferrerTabContent referral={referral} />
            )}
          </EnhancedTabsContent>
          
          <EnhancedTabsContent value="rtt-pathway" className="space-y-3">
            <RTTPathwayTabContent referral={referral} />
          </EnhancedTabsContent>
        </EnhancedTabs>
      </CardContent>
    </Card>
  );
};

export default ReferralDetail;
