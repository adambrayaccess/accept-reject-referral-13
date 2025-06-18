
import { format } from 'date-fns';
import { MHASection } from '@/types/referral';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, User, Building2 } from 'lucide-react';

interface MHATabProps {
  mhaSections: MHASection[] | undefined;
}

const MHATab = ({ mhaSections }: MHATabProps) => {
  if (!mhaSections || mhaSections.length === 0) {
    return (
      <p className="text-muted-foreground">No Mental Health Act sections on record for this patient.</p>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800';
      case 'discharged':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {mhaSections.map((section) => (
        <div key={section.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-medium">
                Section {section.sectionNumber}: {section.sectionTitle}
              </h3>
            </div>
            <Badge className={getStatusColor(section.status)}>
              {section.status.charAt(0).toUpperCase() + section.status.slice(1)}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Applied:</span>
              <span>{format(new Date(section.appliedDate), 'dd MMM yyyy')}</span>
            </div>

            {section.expiryDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Expires:</span>
                <span>{format(new Date(section.expiryDate), 'dd MMM yyyy')}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Consultant:</span>
              <span>{section.consultantResponsible}</span>
            </div>

            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Hospital:</span>
              <span>{section.hospital}</span>
            </div>

            {section.reviewDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Next Review:</span>
                <span>{format(new Date(section.reviewDate), 'dd MMM yyyy')}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Reason for Section:</span>
              <p className="text-sm mt-1">{section.reason}</p>
            </div>

            {section.notes && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Additional Notes:</span>
                <p className="text-sm mt-1">{section.notes}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MHATab;
