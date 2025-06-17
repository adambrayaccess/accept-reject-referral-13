
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { GripVertical, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Referral } from '@/types/referral';
import { Draggable } from 'react-beautiful-dnd';
import ReferralPriorityBadge from '@/components/dashboard/ReferralPriorityBadge';
import AppointmentStatus from './AppointmentStatus';
import WaitingListAIActions from './WaitingListAIActions';
import SubReferralIndicator from './SubReferralIndicator';
import {
  calculateReferralAgeDays,
  calculatePatientAge,
  getLocationFromAddress
} from './utils/waitingListUtils';

interface PatientTableRowProps {
  referral: Referral;
  index: number;
  isSelected: boolean;
  onSelectReferral: (referral: Referral) => void;
  onRowClick?: (referral: Referral) => void;
  isDragDisabled?: boolean;
}

const PatientTableRow = ({
  referral,
  index,
  isSelected,
  onSelectReferral,
  onRowClick,
  isDragDisabled = false
}: PatientTableRowProps) => {
  const referralAge = calculateReferralAgeDays(referral.created);
  const patientAge = calculatePatientAge(referral.patient.birthDate);
  const location = getLocationFromAddress(referral.patient.address);
  const tags = referral.tags || [];

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectReferral(referral);
  };

  const handleRowClick = () => {
    if (!isDragDisabled && onRowClick) {
      onRowClick(referral);
    }
  };

  return (
    <Draggable 
      key={referral.id} 
      draggableId={referral.id} 
      index={index} 
      isDragDisabled={isDragDisabled}
    >
      {(provided, snapshot) => (
        <TableRow 
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`hover:bg-muted/50 cursor-pointer ${
            snapshot.isDragging ? 'bg-muted shadow-lg' : ''
          } ${isDragDisabled ? 'opacity-50' : ''} ${
            isSelected ? 'bg-blue-50' : ''
          }`}
          onClick={handleRowClick}
        >
          <TableCell className="p-2">
            <div 
              {...provided.dragHandleProps}
              className={`p-1 hover:bg-muted rounded ${
                isDragDisabled 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'cursor-grab active:cursor-grabbing'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-3 w-3 text-muted-foreground" />
            </div>
          </TableCell>
          <TableCell className="p-2" onClick={handleCheckboxChange}>
            <Checkbox 
              checked={isSelected}
              onCheckedChange={() => onSelectReferral(referral)}
              aria-label={`Select referral for ${referral.patient.name}`}
            />
          </TableCell>
          <TableCell className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <Link 
                  to={`/referral/${referral.id}`}
                  className="font-bold underline text-xs"
                  style={{ color: '#007373' }}
                  onClick={(e) => !isDragDisabled && e.stopPropagation()}
                >
                  {referral.patient.name}
                </Link>
                <div className="text-xs text-muted-foreground font-mono">
                  NHS: {referral.patient.nhsNumber}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </TableCell>
          <TableCell className="p-2 text-xs">{patientAge} years</TableCell>
          <TableCell className="p-2">
            <ReferralPriorityBadge priority={referral.priority} />
          </TableCell>
          <TableCell className="p-2 text-xs">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span>{referralAge} days</span>
            </div>
          </TableCell>
          <TableCell className="p-2 text-xs">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span>{location}</span>
            </div>
          </TableCell>
          <TableCell className="p-2 text-xs">
            <div className="font-medium">{referral.referrer.name}</div>
            <div className="text-xs text-muted-foreground">{referral.referrer.organization}</div>
          </TableCell>
          <TableCell className="p-2 text-xs">
            <div>{format(new Date(referral.created), 'dd MMM yyyy')}</div>
            <div>{format(new Date(referral.created), 'HH:mm')}</div>
          </TableCell>
          <TableCell className="p-2">
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
          <TableCell className="p-2">
            <AppointmentStatus referral={referral} variant="compact" />
          </TableCell>
          <TableCell className="p-2">
            <WaitingListAIActions referral={referral} variant="compact" />
          </TableCell>
          <TableCell className="p-2">
            <SubReferralIndicator referral={referral} variant="compact" />
          </TableCell>
        </TableRow>
      )}
    </Draggable>
  );
};

export default PatientTableRow;
