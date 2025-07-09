
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
import PatientRowActions from './PatientRowActions';
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
          />
          <PatientMetrics referral={referral} />
          <PatientReferralDetails referral={referral} />
          <PatientStatusInfo referral={referral} />
          <TableCell className="p-2">
            <div className="flex items-center gap-2">
              {/* Sub-referral expand/collapse button */}
              {(referral.isSubReferral || (referral.childReferralIds && referral.childReferralIds.length > 0)) && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto w-auto p-1 hover:bg-opacity-30"
                    style={{ 
                      backgroundColor: '#007A7A20',
                      color: '#007A7A'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#007A7A40';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#007A7A20';
                    }}
                    onClick={handleToggleExpanded}
                  >
                    <LayoutList className="h-3 w-3" />
                    {isExpanded ? (
                      <ChevronDown className="h-2 w-2 ml-0.5" style={{ color: '#007A7A' }} />
                    ) : (
                      <ChevronRight className="h-2 w-2 ml-0.5" style={{ color: '#007A7A' }} />
                    )}
                  </Button>
                  <CircleDot 
                    className="absolute -top-1 -right-1 h-2 w-2 fill-current" 
                    style={{ color: '#613249' }}
                  />
                </div>
              )}
              <PatientRowActions referral={referral} />
            </div>
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
