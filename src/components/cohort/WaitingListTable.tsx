
import { useState } from 'react';
import { Referral } from '@/types/referral';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { differenceInDays, format } from 'date-fns';
import { GripVertical, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WaitingListTableProps {
  referrals: Referral[];
  isLoading: boolean;
  selectedReferrals: Referral[];
  onSelectReferral: (referral: Referral) => void;
  onReorderReferrals: (reorderedReferrals: Referral[]) => void;
}

const WaitingListTable = ({ 
  referrals, 
  isLoading, 
  selectedReferrals,
  onSelectReferral,
  onReorderReferrals
}: WaitingListTableProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-16 rounded-lg border border-border bg-card animate-pulse" />
        ))}
      </div>
    );
  }

  if (referrals.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No patients found on waiting list.</p>
      </div>
    );
  }

  const calculateReferralAgeDays = (created: string) => {
    return differenceInDays(new Date(), new Date(created));
  };

  const calculatePatientAge = (birthDate: string) => {
    return Math.floor(differenceInDays(new Date(), new Date(birthDate)) / 365);
  };

  const getLocationFromAddress = (address?: string) => {
    if (!address) return 'Unknown';
    const parts = address.split(',');
    return parts.pop()?.trim() || 'Unknown';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'routine': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'urgent': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'emergency': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newReferrals = [...referrals];
    const draggedReferral = newReferrals[draggedIndex];
    
    // Remove the dragged item
    newReferrals.splice(draggedIndex, 1);
    
    // Insert at new position
    newReferrals.splice(dropIndex, 0, draggedReferral);
    
    onReorderReferrals(newReferrals);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead className="w-12"></TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Days Waiting</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Referrer</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrals.map((referral, index) => {
            const isSelected = selectedReferrals.some(r => r.id === referral.id);
            const referralAge = calculateReferralAgeDays(referral.created);
            const patientAge = calculatePatientAge(referral.patient.birthDate);
            const location = getLocationFromAddress(referral.patient.address);
            const tags = referral.tags || [];
            const isDraggedOver = dragOverIndex === index;

            return (
              <TableRow 
                key={referral.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  ${isSelected ? 'bg-muted' : ''}
                  ${isDraggedOver ? 'border-t-2 border-primary' : ''}
                  ${draggedIndex === index ? 'opacity-50' : ''}
                  cursor-move transition-colors
                `}
              >
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 cursor-grab active:cursor-grabbing"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Checkbox 
                    checked={isSelected}
                    onCheckedChange={() => onSelectReferral(referral)}
                  />
                </TableCell>
                <TableCell>
                  <Link 
                    to={`/referral/${referral.id}`}
                    className="hover:underline font-medium"
                  >
                    {referral.patient.name}
                  </Link>
                  <div className="text-xs text-muted-foreground font-mono">
                    NHS: {referral.patient.nhsNumber}
                  </div>
                </TableCell>
                <TableCell>{patientAge} years</TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(referral.priority)}>
                    {referral.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>{referralAge} days</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">{referral.referrer.name}</div>
                    <div className="text-xs text-muted-foreground">{referral.referrer.organization}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {format(new Date(referral.created), 'dd/MM/yyyy')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(referral.created), 'HH:mm')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-32">
                    {tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default WaitingListTable;
