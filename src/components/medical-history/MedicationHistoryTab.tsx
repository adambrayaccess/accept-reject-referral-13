
import { MedicationPrescription } from '@/types/medical';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Pill } from 'lucide-react';

interface MedicationHistoryTabProps {
  medicationHistory: MedicationPrescription[] | undefined;
}

const MedicationHistoryTab = ({ medicationHistory }: MedicationHistoryTabProps) => {
  const hasMedications = medicationHistory && medicationHistory.length > 0;

  if (!hasMedications) {
    return (
      <div className="text-center py-8">
        <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No medication history available for this patient.</p>
      </div>
    );
  }

  // Sort medications by prescribed date (most recent first)
  const sortedMedications = [...medicationHistory].sort((a, b) => 
    new Date(b.prescribedDate).getTime() - new Date(a.prescribedDate).getTime()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'discontinued':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {sortedMedications.map((medication) => (
        <Card key={medication.id} className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-lg">{medication.name}</h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(medication.status)}`}
                  >
                    {medication.status.charAt(0).toUpperCase() + medication.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Dosage</div>
                    <div className="font-medium">{medication.dosage}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Frequency</div>
                    <div className="font-medium">{medication.frequency}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Indication</div>
                    <div className="font-medium">{medication.indication}</div>
                  </div>
                </div>
              </div>
              
              <div className="lg:text-right space-y-1">
                <div className="text-xs text-muted-foreground">Prescribed</div>
                <div className="text-sm font-medium">
                  {format(new Date(medication.prescribedDate), 'dd MMM yyyy')}
                </div>
                <div className="text-xs text-muted-foreground">
                  by {medication.prescribedBy}
                </div>
              </div>
            </div>
            
            {medication.endDate && (
              <>
                <Separator className="my-3" />
                <div className="text-sm">
                  <span className="text-muted-foreground">End date: </span>
                  <span className="font-medium">
                    {format(new Date(medication.endDate), 'dd MMM yyyy')}
                  </span>
                </div>
              </>
            )}
            
            {medication.notes && (
              <>
                <Separator className="my-3" />
                <div className="text-sm">
                  <div className="text-xs font-medium text-muted-foreground mb-1">Notes</div>
                  <div className="text-muted-foreground">{medication.notes}</div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MedicationHistoryTab;
