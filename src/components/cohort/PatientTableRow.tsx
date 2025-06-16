
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { GripVertical, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Referral } from '@/types/referral';
import ReferralPriorityBadge from '@/components/dashboard/ReferralPriorityBadge';
import {
  calculateReferralAgeDays,
  calculatePatientAge,
  getLocationFromAddress
} from './utils/waitingListUtils';

interface PatientTableRowProps {
  referral: Referral;
  index: number;
  isSelected: boolean;
  isDraggedOver: boolean;
  isDragging: boolean;
  onSelectReferral: (referral: Referral) => void;
  onDragStart: (e: React.DragEvent, referral: Referral) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
}

const PatientTableRow = ({
  referral,
  index,
  isSelected,
  isDraggedOver,
  isDragging,
  onSelectReferral,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd
}: PatientTableRowProps) => {
  const referralAge = calculateReferralAgeDays(referral.created);
  const patientAge = calculatePatientAge(referral.patient.birthDate);
  const location = getLocationFromAddress(referral.patient.address);
  const tags = referral.tags || [];

  return (
    <TableRow 
      key={referral.id}
      draggable
      onDragStart={(e) => onDragStart(e, referral)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={onDragEnd}
      className={`
        ${isSelected ? 'bg-muted' : ''}
        ${isDraggedOver ? 'border-t-2 border-primary' : ''}
        ${isDragging ? 'opacity-50' : ''}
        cursor-move transition-all duration-200
      `}
    >
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => e.preventDefault()}
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
        <ReferralPriorityBadge priority={referral.priority} />
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
};

export default PatientTableRow;
