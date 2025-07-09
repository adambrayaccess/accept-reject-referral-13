
import { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { GripVertical, ChevronDown, ChevronRight, LayoutList, CircleDot } from 'lucide-react';
import { Referral } from '@/types/referral';
import { Draggable } from 'react-beautiful-dnd';
import PatientInfo from './PatientInfo';
import PatientMetrics from './PatientMetrics';
import PatientReferralDetails from './PatientReferralDetails';
import PatientStatusInfo from './PatientStatusInfo';
import ReferralTableExpandedContent from '@/components/dashboard/ReferralTableExpandedContent';

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
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectReferral(referral);
  };

  const handleToggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
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
    <>
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
            isExpanded={isExpanded}
            onToggleExpanded={handleToggleExpanded}
          />
          <PatientMetrics referral={referral} />
          <PatientReferralDetails referral={referral} />
          <PatientStatusInfo referral={referral} />
          <TableCell className="p-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </TableCell>
        </TableRow>
      )}
    </Draggable>
    {isExpanded && (
      <TableRow>
        <TableCell colSpan={13} className="p-0 border-t-0">
          <ReferralTableExpandedContent referral={referral} />
        </TableCell>
      </TableRow>
    )}
    </>
  );
};

export default PatientTableRow;
