
import { TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, LayoutList } from 'lucide-react';
import { Referral } from '@/types/referral';
import PatientDetailsPopover from '@/components/PatientDetailsPopover';

interface PatientInfoProps {
  referral: Referral;
  isDragDisabled: boolean;
  onNameClick?: (referral: Referral) => void;
  isExpanded?: boolean;
  onToggleExpanded?: (e: React.MouseEvent) => void;
}

const PatientInfo = ({ referral, isDragDisabled, onNameClick, isExpanded, onToggleExpanded }: PatientInfoProps) => {
  const handleNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragDisabled && onNameClick) {
      onNameClick(referral);
    }
  };

  return (
    <TableCell className="p-2">
      <div className="flex items-center justify-between">
        <div>
          <PatientDetailsPopover patient={referral.patient}>
            <Button
              variant="link"
              className="font-bold underline p-0 h-auto text-sm"
              style={{ color: '#007373' }}
              onClick={handleNameClick}
              disabled={isDragDisabled}
            >
              {referral.patient.name}
            </Button>
          </PatientDetailsPopover>
          {/* Sub-referral expand/collapse button */}
          {onToggleExpanded && (
            <div className="relative mt-1">
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
                onClick={onToggleExpanded}
              >
                <LayoutList className="h-3 w-3" />
                {isExpanded ? (
                  <ChevronDown className="h-2 w-2 ml-0.5" style={{ color: '#007A7A' }} />
                ) : (
                  <ChevronRight className="h-2 w-2 ml-0.5" style={{ color: '#007A7A' }} />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </TableCell>
  );
};

export default PatientInfo;
