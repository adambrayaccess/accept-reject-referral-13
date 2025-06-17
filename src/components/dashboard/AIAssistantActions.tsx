
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronDown, Users, Bot, Calendar, FileText, TrendingUp, Clock, UserPlus, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Referral } from '@/types/referral';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AIAssistantActionsProps {
  selectedReferrals?: Referral[];
  onClearSelection?: () => void;
  context?: 'dashboard' | 'waitingList';
}

const AIAssistantActions = ({ 
  selectedReferrals = [], 
  onClearSelection,
  context = 'dashboard'
}: AIAssistantActionsProps) => {
  const { toast } = useToast();
  const hasSelection = selectedReferrals.length > 0;

  // Dashboard actions
  const handleAutoTriage = () => {
    toast({
      title: "AI Assistant",
      description: "Auto-triaging new referrals...",
    });
    console.log('Auto triage triggered');
  };

  const handleSmartAllocate = () => {
    toast({
      title: "AI Assistant", 
      description: "Smart allocating referrals to clinicians...",
    });
    console.log('Smart allocate triggered');
  };

  const handlePriorityOptimization = () => {
    toast({
      title: "AI Assistant",
      description: "Optimizing referral priorities...",
    });
    console.log('Priority optimization triggered');
  };

  // Waiting List actions
  const handleAppointmentOptimization = () => {
    toast({
      title: "AI Assistant",
      description: "Optimizing appointment scheduling...",
    });
    console.log('Appointment optimization triggered');
  };

  const handleWaitTimeReduction = () => {
    toast({
      title: "AI Assistant",
      description: "Analyzing wait time reduction opportunities...",
    });
    console.log('Wait time reduction triggered');
  };

  const handleClinicalPrioritization = () => {
    toast({
      title: "AI Assistant",
      description: "Re-prioritizing based on clinical urgency...",
    });
    console.log('Clinical prioritization triggered');
  };

  // Bulk actions for dashboard
  const handleBulkTriage = () => {
    toast({
      title: "AI Assistant",
      description: `Triaging ${selectedReferrals.length} referrals...`,
    });
    console.log('Bulk triage triggered for:', selectedReferrals.map(r => r.id));
    onClearSelection?.();
  };

  const handleBulkAllocate = () => {
    toast({
      title: "AI Assistant",
      description: `Allocating ${selectedReferrals.length} referrals...`,
    });
    console.log('Bulk allocate triggered for:', selectedReferrals.map(r => r.id));
    onClearSelection?.();
  };

  const handleBulkPriorityUpdate = () => {
    toast({
      title: "AI Assistant",
      description: `Updating priority for ${selectedReferrals.length} referrals...`,
    });
    console.log('Bulk priority update triggered for:', selectedReferrals.map(r => r.id));
    onClearSelection?.();
  };

  // Bulk actions for waiting list
  const handleBulkScheduleOptimization = () => {
    toast({
      title: "AI Assistant",
      description: `Optimizing schedules for ${selectedReferrals.length} patients...`,
    });
    console.log('Bulk schedule optimization triggered for:', selectedReferrals.map(r => r.id));
    onClearSelection?.();
  };

  const handleBulkWaitTimeAnalysis = () => {
    toast({
      title: "AI Assistant", 
      description: `Analyzing wait times for ${selectedReferrals.length} patients...`,
    });
    console.log('Bulk wait time analysis triggered for:', selectedReferrals.map(r => r.id));
    onClearSelection?.();
  };

  const handleBulkClinicalReview = () => {
    toast({
      title: "AI Assistant",
      description: `Reviewing clinical priority for ${selectedReferrals.length} patients...`,
    });
    console.log('Bulk clinical review triggered for:', selectedReferrals.map(r => r.id));
    onClearSelection?.();
  };

  const getDashboardActions = () => {
    if (hasSelection) {
      return [
        {
          label: 'Auto-triage selected referrals',
          icon: <Sparkles className="mr-2 h-4 w-4 text-purple-600" />,
          handler: handleBulkTriage
        },
        {
          label: 'Smart allocate to clinicians',
          icon: <UserPlus className="mr-2 h-4 w-4 text-purple-600" />,
          handler: handleBulkAllocate
        },
        {
          label: 'Update priority intelligently',
          icon: <TrendingUp className="mr-2 h-4 w-4 text-purple-600" />,
          handler: handleBulkPriorityUpdate
        }
      ];
    } else {
      return [
        {
          label: 'Auto-triage new referrals',
          icon: <Stethoscope className="mr-2 h-4 w-4 text-purple-600" />,
          handler: handleAutoTriage
        },
        {
          label: 'Smart allocate to clinicians',
          icon: <UserPlus className="mr-2 h-4 w-4 text-purple-600" />,
          handler: handleSmartAllocate
        },
        {
          label: 'Optimize referral priorities',
          icon: <TrendingUp className="mr-2 h-4 w-4 text-purple-600" />,
          handler: handlePriorityOptimization
        }
      ];
    }
  };

  const getWaitingListActions = () => {
    if (hasSelection) {
      return [
        {
          label: 'Optimize scheduling for selected',
          icon: <Calendar className="mr-2 h-4 w-4 text-purple-600" />,
          handler: handleBulkScheduleOptimization
        },
        {
          label: 'Analyze wait times',
          icon: <Clock className="mr-2 h-4 w-4 text-purple-600" />,
          handler: handleBulkWaitTimeAnalysis
        },
        {
          label: 'Review clinical priority',
          icon: <Stethoscope className="mr-2 h-4 w-4 text-purple-600" />,
          handler: handleBulkClinicalReview
        }
      ];
    } else {
      return [
        {
          label: 'Optimize appointment scheduling',
          icon: <Calendar className="mr-2 h-4 w-4 text-purple-600" />,
          handler: handleAppointmentOptimization
        },
        {
          label: 'Reduce wait times',
          icon: <Clock className="mr-2 h-4 w-4 text-purple-600" />,
          handler: handleWaitTimeReduction
        },
        {
          label: 'Clinical prioritization',
          icon: <Stethoscope className="mr-2 h-4 w-4 text-purple-600" />,
          handler: handleClinicalPrioritization
        }
      ];
    }
  };

  const actions = context === 'dashboard' ? getDashboardActions() : getWaitingListActions();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`flex items-center gap-2 ${
            hasSelection 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          {hasSelection ? (
            <>
              <Users className="h-4 w-4" />
              Bulk Actions ({selectedReferrals.length})
            </>
          ) : (
            'Copilot Actions'
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white border border-gray-200 shadow-lg z-50"
      >
        {actions.map((action, index) => (
          <DropdownMenuItem key={index} onClick={action.handler}>
            {action.icon}
            {action.label}
            <span className="ml-auto text-xs text-purple-600 font-semibold">AI-Powered</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AIAssistantActions;
