
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
          <TableCell>
            <div 
              {...provided.dragHandleProps}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <ReferralPriorityBadge priority={referral.priority} />
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </TableCell>
          <TableCell>
            <Button
              variant="link"
              className="font-medium hover:underline p-0 h-auto"
              style={{ color: '#006262' }}
              onClick={(e) => onNameClick(e, referral.id)}
            >
              {referral.patient.name}
            </Button>
          </TableCell>
          <TableCell>{referral.patient.gender}</TableCell>
          <TableCell className="font-mono text-sm">{referral.patient.nhsNumber}</TableCell>
          <TableCell className="font-mono text-sm">{referral.ubrn}</TableCell>
          <TableCell className="text-sm">
            <div>{format(new Date(referral.created), 'dd MMM yyyy')}</div>
            <div>{format(new Date(referral.created), 'HH:mm')}</div>
          </TableCell>
          <TableCell className="font-mono text-sm">{referral.patient.phone || 'N/A'}</TableCell>
          <TableCell>
            <div>{referral.specialty}</div>
            <div className="text-sm text-muted-foreground">{referral.referrer.name}</div>
          </TableCell>
          <TableCell className="max-w-48">
            <div className="text-sm truncate" title={referral.clinicalInfo.reason}>
              {referral.clinicalInfo.reason}
            </div>
          </TableCell>
          <TableCell>
            <ReferralStatusBadge referral={referral} />
          </TableCell>
          <TableCell>
            <ReferralSourceBadge referral={referral} />
          </TableCell>
          <TableCell>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </TableCell>
        </TableRow>
      )}
    </Draggable>
  );
};

export default ReferralTableRow;
