import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CircleDot, Info } from 'lucide-react';
import { TriageStatus } from '@/types/referral';

interface TriageStatusPopoverProps {
  status?: TriageStatus;
}

const getTriageStatusLabel = (status?: TriageStatus) => {
  switch (status) {
    case 'pre-assessment':
      return 'Pre-Assessment';
    case 'assessed':
      return 'Assessed';
    case 'pre-admission-assessment':
      return 'Pre-Admission Assessment';
    case 'waiting-list':
      return 'Waiting List';
    case 'refer-to-another-specialty':
      return 'Refer to Another Specialty';
    case 'discharged':
      return 'Discharged';
    default:
      return 'New';
  }
};

const getTriageStatusDescription = (status?: TriageStatus) => {
  switch (status) {
    case 'pre-assessment':
      return 'Referral is awaiting initial assessment by the clinical team.';
    case 'assessed':
      return 'Referral has been assessed and clinical decisions have been made.';
    case 'pre-admission-assessment':
      return 'Referral requires pre-admission assessment before treatment.';
    case 'waiting-list':
      return 'Referral has been added to the waiting list for treatment.';
    case 'refer-to-another-specialty':
      return 'Referral needs to be transferred to a different specialty.';
    case 'discharged':
      return 'Referral has been completed and patient discharged.';
    default:
      return 'New referral that has not yet been triaged or assessed.';
  }
};

const getTriageStatusStyle = (status?: TriageStatus) => {
  switch (status) {
    case 'pre-assessment':
      return 'text-blue-800 bg-blue-100 border-blue-200';
    case 'assessed':
      return 'text-green-800 bg-green-100 border-green-200';
    case 'pre-admission-assessment':
      return 'text-yellow-800 bg-yellow-100 border-yellow-200';
    case 'waiting-list':
      return 'text-purple-800 bg-purple-100 border-purple-200';
    case 'refer-to-another-specialty':
      return 'text-orange-800 bg-orange-100 border-orange-200';
    case 'discharged':
      return 'text-gray-800 bg-gray-100 border-gray-200';
    default:
      return 'text-blue-800 bg-blue-100 border-blue-200';
  }
};

const TriageStatusPopover = ({ status }: TriageStatusPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Badge 
            variant="outline" 
            className={`text-xs cursor-pointer hover:opacity-80 ${getTriageStatusStyle(status)}`}
          >
            <CircleDot className="h-3 w-3 mr-1" />
            {getTriageStatusLabel(status)}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-white border shadow-lg z-50" align="start">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Triage Status</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`text-xs ${getTriageStatusStyle(status)}`}
              >
                <CircleDot className="h-3 w-3 mr-1" />
                {getTriageStatusLabel(status)}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {getTriageStatusDescription(status)}
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TriageStatusPopover;