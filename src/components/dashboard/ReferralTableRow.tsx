
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
import { Referral } from '@/types/referral';
import { Draggable } from 'react-beautiful-dnd';
import ReferralPriorityBadge from './ReferralPriorityBadge';
// Removed ReferralStatusBadge import - using inline text instead
import ReferralSourceBadge from './ReferralSourceBadge';
import ReferralTypeBadge from './ReferralTypeBadge';
import PinButton from '@/components/ui/pin-button';
import { usePinning } from '@/hooks/usePinning';

const getStatusText = (referral: Referral) => {
  if (referral.status === 'accepted' && referral.triageStatus) {
    switch (referral.triageStatus) {
      case 'pre-assessment':
        return 'Pre-Assess';
      case 'assessed':
        return 'Assessed';
      case 'waiting-list':
        return 'Waiting List';
      case 'refer-to-another-specialty':
        return 'Refer on';
      default:
        return referral.triageStatus;
    }
  }

  switch (referral.status) {
    case 'new':
      return 'New';
    case 'accepted':
      return 'Accepted';
    case 'rejected':
      return 'Rejected';
    default:
      return referral.status.charAt(0).toUpperCase() + referral.status.slice(1);
  }
};

const getStatusTextColor = (referral: Referral) => {
  if (referral.status === 'accepted' && referral.triageStatus) {
    switch (referral.triageStatus) {
      case 'pre-assessment':
        return 'text-yellow-600';
      case 'assessed':
        return 'text-purple-600';
      case 'waiting-list':
        return 'text-blue-600';
      case 'refer-to-another-specialty':
        return 'text-gray-600';
      default:
        return 'text-gray-500';
    }
  }

  switch (referral.status) {
    case 'new':
      return 'text-blue-600';
    case 'accepted':
      return 'text-green-600';
    case 'rejected':
      return 'text-red-600';
    default:
      return 'text-gray-500';
  }
};

interface ReferralTableRowProps {
  referral: Referral;
  index: number;
  onNameClick: (e: React.MouseEvent, referralId: string) => void;
  onRowClick: (referralId: string) => void;
  isDragDisabled?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (referralId: string) => void;
}

const ReferralTableRow = ({ 
  referral, 
  index, 
  onNameClick, 
  onRowClick, 
  isDragDisabled = false,
  isSelected = false,
  onToggleSelection
}: ReferralTableRowProps) => {
  const { isPinned, togglePin } = usePinning();
  
  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelection?.(referral.id);
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
          className={`bg-white hover:bg-gray-50 cursor-pointer ${
            snapshot.isDragging ? 'bg-gray-100 shadow-lg' : ''
          } ${isDragDisabled ? 'opacity-50' : ''} ${
            isSelected ? 'bg-blue-50' : ''
          }`}
          onClick={() => !isDragDisabled && onRowClick(referral.id)}
        >
          <TableCell className="p-2" onClick={handleCheckboxChange}>
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => {
                console.log('Checkbox changed:', checked, 'for referral:', referral.id);
                onToggleSelection?.(referral.id);
              }}
              aria-label={`Select referral for ${referral.patient.name}`}
            />
          </TableCell>
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
          <TableCell className="p-2">
            <div className="flex items-center gap-1">
              <ReferralPriorityBadge priority={referral.priority} />
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </div>
          </TableCell>
          <TableCell className="p-2">
            <div className="flex items-center gap-2">
              <Button
                variant="link"
                className="font-bold underline p-0 h-auto text-sm"
                style={{ color: '#007373' }}
                onClick={(e) => !isDragDisabled && onNameClick(e, referral.id)}
                disabled={isDragDisabled}
              >
                {referral.patient.name}
              </Button>
              <PinButton
                isPinned={isPinned(referral.id)}
                onTogglePin={() => togglePin(referral.id)}
                size="sm"
                variant="ghost"
              />
            </div>
          </TableCell>
          <TableCell className="p-2 text-sm">{referral.patient.gender}</TableCell>
          <TableCell className="p-2 font-mono text-sm">{referral.patient.nhsNumber}</TableCell>
          <TableCell className="p-2 font-mono text-sm">{referral.ubrn}</TableCell>
          <TableCell className="p-2 text-sm">
            <div>{format(new Date(referral.created), 'dd MMM yyyy')}</div>
            <div>{format(new Date(referral.created), 'HH:mm')}</div>
          </TableCell>
          <TableCell className="p-2 font-mono text-sm">{referral.patient.phone || 'N/A'}</TableCell>
          <TableCell className="p-2 text-sm">
            <div>{referral.specialty}</div>
            <div className="text-sm text-muted-foreground">{referral.referrer.name}</div>
          </TableCell>
          <TableCell className="p-2 max-w-32">
            <div className="text-sm truncate" title={referral.clinicalInfo.reason}>
              {referral.clinicalInfo.reason}
            </div>
          </TableCell>
          <TableCell className="p-2">
            <div 
              className={`text-sm font-bold ${getStatusTextColor(referral)}`}
              title={`Status: ${getStatusText(referral)}`}
            >
              {getStatusText(referral).toUpperCase()}
            </div>
          </TableCell>
          <TableCell className="p-2">
            <ReferralSourceBadge referral={referral} />
          </TableCell>
          <TableCell className="p-2">
            <ReferralTypeBadge referral={referral} />
          </TableCell>
          <TableCell className="p-2">
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          </TableCell>
        </TableRow>
      )}
    </Draggable>
  );
};

export default ReferralTableRow;
