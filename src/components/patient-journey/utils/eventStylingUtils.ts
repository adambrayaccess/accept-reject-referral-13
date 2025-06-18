
import { 
  FileText, 
  Activity, 
  Calendar, 
  ClipboardList, 
  Clock,
  Upload,
  Phone,
  Mail,
  MessageSquare,
  UserCheck,
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { JourneyEvent } from './journeyEventUtils';

export const getEventIcon = (type: JourneyEvent['type']) => {
  switch (type) {
    case 'referral':
      return <FileText className="h-4 w-4 text-white" />;
    case 'document':
      return <Upload className="h-4 w-4 text-white" />;
    case 'appointment':
      return <Calendar className="h-4 w-4 text-white" />;
    case 'triage':
      return <ClipboardList className="h-4 w-4 text-white" />;
    case 'pathway':
      return <Clock className="h-4 w-4 text-white" />;
    case 'phone-call':
      return <Phone className="h-4 w-4 text-white" />;
    case 'letter':
      return <Mail className="h-4 w-4 text-white" />;
    case 'communication':
      return <MessageSquare className="h-4 w-4 text-white" />;
    case 'booking':
      return <UserCheck className="h-4 w-4 text-white" />;
    case 'assessment':
      return <Stethoscope className="h-4 w-4 text-white" />;
    default:
      return <Activity className="h-4 w-4 text-white" />;
  }
};

export const getEventColor = (type: JourneyEvent['type'], status?: string, priority?: string) => {
  if (priority === 'high') return 'bg-red-600'; // High priority red
  if (status === 'cancelled') return 'bg-gray-400';
  
  switch (type) {
    case 'referral':
      return 'bg-[#007A7A]'; // Primary teal
    case 'document':
      return 'bg-purple-600'; // Purple for documents
    case 'appointment':
      return 'bg-orange-600'; // Orange for appointments
    case 'triage':
      return 'bg-[#973060]'; // Purple-pink for triage
    case 'pathway':
      return 'bg-indigo-600'; // Indigo for pathways
    case 'phone-call':
      return 'bg-emerald-600'; // Emerald for phone calls
    case 'letter':
      return 'bg-amber-600'; // Amber for letters
    case 'communication':
      return 'bg-cyan-600'; // Cyan for other communications
    case 'booking':
      return 'bg-blue-600'; // Blue for bookings
    case 'assessment':
      return 'bg-green-600'; // Green for assessments
    default:
      return 'bg-gray-500';
  }
};

export const getStatusIcon = (status?: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-3 w-3 text-green-600" />;
    case 'cancelled':
      return <XCircle className="h-3 w-3 text-red-600" />;
    case 'active':
      return <AlertCircle className="h-3 w-3 text-blue-600" />;
    default:
      return null;
  }
};
