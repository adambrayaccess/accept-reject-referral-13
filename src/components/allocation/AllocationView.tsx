
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Referral, HealthcareProfessional } from '@/types/referral';
import { mockHealthcareProfessionals } from '@/services/mock/healthcareProfessionals';
import WorkloadCard from './WorkloadCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';

interface AllocationViewProps {
  specialty: string;
  referrals: Referral[];
}

const AllocationView = ({ specialty, referrals }: AllocationViewProps) => {
  const [selectedProfessional, setSelectedProfessional] = useState<HealthcareProfessional | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get professionals for this specialty
  const specialtyProfessionals = mockHealthcareProfessionals.filter(
    prof => prof.specialty === specialty
  );

  // Mock allocation logic - in real implementation this would come from a service
  const getAllocatedReferrals = (professionalId: string): Referral[] => {
    const profIndex = specialtyProfessionals.findIndex(p => p.id === professionalId);
    const totalReferrals = referrals.length;
    const refsPerProf = Math.ceil(totalReferrals / specialtyProfessionals.length);
    
    const start = profIndex * refsPerProf;
    const end = Math.min(start + refsPerProf, totalReferrals);
    
    return referrals.slice(start, end);
  };

  const handleViewReferrals = (professional: HealthcareProfessional) => {
    setSelectedProfessional(professional);
    setIsDialogOpen(true);
  };

  const selectedProfessionalReferrals = selectedProfessional 
    ? getAllocatedReferrals(selectedProfessional.id)
    : [];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'new': return 'secondary';
      case 'accepted': return 'default';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getTriageStatusColor = (triageStatus?: string) => {
    switch (triageStatus) {
      case 'pre-assessment': return 'text-purple-600';
      case 'assessed': return 'text-indigo-600';
      case 'waiting-list': return 'text-orange-600';
      case 'pre-admission-assessment': return 'text-teal-600';
      case 'refer-to-another-specialty': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">{specialty} Allocation</h3>
        <p className="text-muted-foreground">
          Healthcare professionals and their current workload
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {specialtyProfessionals.map((professional) => (
          <WorkloadCard
            key={professional.id}
            professional={professional}
            allocatedReferrals={getAllocatedReferrals(professional.id)}
            onViewReferrals={handleViewReferrals}
          />
        ))}
      </div>

      {/* Referral Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProfessional?.name} - Allocated Referrals
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                {selectedProfessionalReferrals.length} Referrals
              </Badge>
              <Badge variant="outline">
                {selectedProfessional?.role}
              </Badge>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>UBRN</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Triage Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Age</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedProfessionalReferrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">
                      {referral.patient.name}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {referral.ubrn}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(referral.status)}>
                        {referral.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${getTriageStatusColor(referral.triageStatus)}`}>
                        {referral.triageStatus || 'Not triaged'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={referral.priority === 'urgent' ? 'destructive' : 'outline'}
                      >
                        {referral.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(referral.created), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllocationView;
