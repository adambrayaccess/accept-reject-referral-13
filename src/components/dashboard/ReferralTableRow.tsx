
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
import { Referral } from '@/types/referral';
import { Draggable } from 'react-beautiful-dnd';
import ReferralPriorityBadge from './ReferralPriorityBadge';
import ReferralStatusBadge from './ReferralStatusBadge';
import ReferralSourceBadge from './ReferralSourceBadge';

interface ReferralTableRowProps {
  referral: Referral;
  index: number;
  onNameClick: (e: React.MouseEvent, referralId: string) => void;
  onRowClick: (referralId: string) => void;
}

const ReferralTableRow = ({ referral, index, onNameClick, onRowClick }: ReferralTableRowProps) => {
  return (
    <Draggable key={referral.id} draggableId={referral.id} index={index}>
      {(provided, snapshot) => (
        <TableRow 
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`hover:bg-muted/50 cursor-pointer ${
            snapshot.isDragging ? 'bg-muted shadow-lg' : ''
          }`}
          onClick={() => onRowClick(referral.id)}
        >
          <TableCell className="p-2">
            <div 
              {...provided.dragHandleProps}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
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
            <Button
              variant="link"
              className="font-bold underline p-0 h-auto text-xs"
              style={{ color: '#007373' }}
              onClick={(e) => onNameClick(e, referral.id)}
            >
              {referral.patient.name}
            </Button>
          </TableCell>
          <TableCell className="p-2 text-xs">{referral.patient.gender}</TableCell>
          <TableCell className="p-2 font-mono text-xs">{referral.patient.nhsNumber}</TableCell>
          <TableCell className="p-2 font-mono text-xs">{referral.ubrn}</TableCell>
          <TableCell className="p-2 text-xs">
            <div>{format(new Date(referral.created), 'dd MMM yyyy')}</div>
            <div>{format(new Date(referral.created), 'HH:mm')}</div>
          </TableCell>
          <TableCell className="p-2 font-mono text-xs">{referral.patient.phone || 'N/A'}</TableCell>
          <TableCell className="p-2 text-xs">
            <div>{referral.specialty}</div>
            <div className="text-xs text-muted-foreground">{referral.referrer.name}</div>
          </TableCell>
          <TableCell className="p-2 max-w-32">
            <div className="text-xs truncate" title={referral.clinicalInfo.reason}>
              {referral.clinicalInfo.reason}
            </div>
          </TableCell>
          <TableCell className="p-2">
            <ReferralStatusBadge referral={referral} />
          </TableCell>
          <TableCell className="p-2">
            <ReferralSourceBadge referral={referral} />
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
