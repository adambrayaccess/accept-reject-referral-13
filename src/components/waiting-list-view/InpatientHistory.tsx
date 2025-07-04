import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, BedDouble, Calendar, MapPin, Activity } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface InpatientAdmission {
  id: string;
  ward: string;
  bed: string;
  bay?: string;
  admissionDateTime: string;
  admissionReason: string;
  currentStatus: 'Active' | 'Discharged' | 'Transferred';
  dischargeDateTime?: string;
  consultant?: string;
  specialty?: string;
}

interface InpatientHistoryProps {
  patientId: string;
}

// Mock data - in real implementation, this would come from a database query
const mockInpatientData: InpatientAdmission[] = [
  {
    id: '1',
    ward: 'Cardiology Ward A',
    bed: 'Bed 12',
    bay: 'Bay 3',
    admissionDateTime: '2024-07-01T14:30:00Z',
    admissionReason: 'Chest pain investigation',
    currentStatus: 'Active',
    consultant: 'Dr. Smith',
    specialty: 'Cardiology'
  },
  {
    id: '2',
    ward: 'Emergency Department',
    bed: 'Bay 5',
    admissionDateTime: '2024-06-15T09:15:00Z',
    admissionReason: 'Acute shortness of breath',
    currentStatus: 'Discharged',
    dischargeDateTime: '2024-06-16T16:45:00Z',
    consultant: 'Dr. Johnson',
    specialty: 'Emergency Medicine'
  }
];

const InpatientHistory = ({ patientId }: InpatientHistoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // In real implementation, you would fetch data based on patientId
  const admissions = mockInpatientData;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Discharged':
        return 'secondary';
      case 'Transferred':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center">
                <BedDouble className="h-5 w-5 mr-2" />
                Inpatient History
                {admissions.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {admissions.length}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            {admissions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No inpatient admission history found
              </p>
            ) : (
              <div className="space-y-4">
                {admissions.map((admission, index) => (
                  <div key={admission.id}>
                    <div className="space-y-3">
                      {/* Status and Location */}
                      <div className="flex items-center justify-between">
                        <Badge variant={getStatusBadgeVariant(admission.currentStatus)}>
                          <Activity className="h-3 w-3 mr-1" />
                          {admission.currentStatus}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {admission.specialty}
                        </div>
                      </div>

                      {/* Ward and Bed Information */}
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{admission.ward}</span>
                        </div>
                        <div className="flex items-center gap-2 ml-6">
                          <span className="text-muted-foreground">Location:</span>
                          <span>
                            {admission.bed}{admission.bay && `, ${admission.bay}`}
                          </span>
                        </div>
                      </div>

                      {/* Admission Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="font-medium">Admitted:</div>
                            <div className="text-muted-foreground">
                              {format(new Date(admission.admissionDateTime), 'dd MMM yyyy, HH:mm')}
                            </div>
                          </div>
                        </div>

                        {admission.dischargeDateTime && (
                          <div className="flex items-start gap-2 ml-6">
                            <div>
                              <div className="font-medium">Discharged:</div>
                              <div className="text-muted-foreground">
                                {format(new Date(admission.dischargeDateTime), 'dd MMM yyyy, HH:mm')}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="border-l-2 border-muted pl-4 ml-2">
                          <div className="font-medium">Reason:</div>
                          <div className="text-muted-foreground">
                            {admission.admissionReason}
                          </div>
                        </div>

                        {admission.consultant && (
                          <div className="text-muted-foreground ml-6">
                            <span className="font-medium">Consultant:</span> {admission.consultant}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {index < admissions.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default InpatientHistory;