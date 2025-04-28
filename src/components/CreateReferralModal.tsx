
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { mockPractitioners } from '@/services/mock/practitioners';
import { Referral, ReferralPriority } from '@/types/referral';

interface CreateReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (referral: Partial<Referral>) => void;
}

const CreateReferralModal = ({ isOpen, onClose, onSubmit }: CreateReferralModalProps) => {
  const [referralId, setReferralId] = useState('');
  const [priority, setPriority] = useState<ReferralPriority>('routine');
  const [specialty, setSpecialty] = useState('');
  const [practitionerId, setPractitionerId] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!referralId || !specialty || !practitionerId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const referrer = mockPractitioners.find(p => p.id === practitionerId);
    
    if (!referrer) {
      toast({
        title: "Error",
        description: "Selected practitioner not found",
        variant: "destructive",
      });
      return;
    }

    const newReferral: Partial<Referral> = {
      id: `REF-${referralId}`,
      created: new Date().toISOString(),
      status: 'new',
      priority,
      specialty,
      referrer,
    };

    onSubmit(newReferral);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Manual Referral</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="referralId">Access Group Referral ID</Label>
            <Input
              id="referralId"
              value={referralId}
              onChange={(e) => setReferralId(e.target.value)}
              placeholder="Enter referral ID"
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

          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty</Label>
            <Input
              id="specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="Enter specialty"
              required
            />
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Referral</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReferralModal;
