
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { GripVertical } from 'lucide-react';
import { Referral } from '@/types/referral';
import { Draggable } from 'react-beautiful-dnd';
import PatientInfo from './PatientInfo';
import PatientMetrics from './PatientMetrics';
import PatientReferralDetails from './PatientReferralDetails';
import PatientStatusInfo from './PatientStatusInfo';
import PatientRowActions from './PatientRowActions';

interface PatientTableRowProps {
  referral: Referral;
  index: number;
  isSelected: boolean;
  onSelectReferral: (referral: Referral) => void;
  onRowClick?: (referral: Referral) => void;
  onNameClick?: (referral: Referral) => void;
  isDragDisabled?: boolean;
}

const PatientTableRow = ({
  referral,
  index,
  isSelected,
  onSelectReferral,
  onRowClick,
  onNameClick,
  isDragDisabled = false
}: PatientTableRowProps) => {
  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectReferral(referral);
  };

  const handleRowClick = () => {
    if (!isDragDisabled && onRowClick) {
      onRowClick(referral);
    }
  };

  const handleNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNameClick) {
      onNameClick(referral);
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
          className={`bg-white hover:bg-gray-50 cursor-pointer ${
            snapshot.isDragging ? 'bg-gray-100 shadow-lg' : ''
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
          <PatientInfo 
            referral={referral} 
            isDragDisabled={isDragDisabled} 
            onNameClick={onNameClick}
          />
          <PatientMetrics referral={referral} />
          <PatientReferralDetails referral={referral} />
          <PatientStatusInfo referral={referral} />
          <PatientRowActions referral={referral} />
        </TableRow>
      )}
    </Draggable>
  );
};

export default PatientTableRow;
