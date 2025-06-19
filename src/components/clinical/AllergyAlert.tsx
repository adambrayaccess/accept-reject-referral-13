
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Allergy, AllergyAlert as AllergyAlertType } from '@/types/allergy';
import { AlertTriangle, Shield, Info } from 'lucide-react';

interface AllergyAlertProps {
  allergy: Allergy;
  alert?: AllergyAlertType;
  compact?: boolean;
}

const AllergyAlert = ({ allergy, alert, compact = false }: AllergyAlertProps) => {
  const getAlertIcon = () => {
    if (allergy.severity === 'life-threatening') return AlertTriangle;
    if (allergy.severity === 'severe') return Shield;
    return Info;
  };

  const getAlertVariant = () => {
    if (allergy.severity === 'life-threatening' || allergy.severity === 'severe') {
      return 'destructive';
    }
    return 'default';
  };

  const AlertIcon = getAlertIcon();

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 border-l-4 border-l-destructive bg-destructive/5">
        <AlertIcon className="h-4 w-4 text-destructive" />
        <div className="flex-1">
          <span className="font-medium text-sm">{allergy.allergen}</span>
          <span className="text-xs text-muted-foreground ml-2">
            ({allergy.severity})
          </span>
        </div>
      </div>
    );
  }

  return (
    <Alert variant={getAlertVariant()} className="mb-3">
      <AlertIcon className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        Critical Allergy Alert
        <Badge variant="destructive" className="text-xs">
          {allergy.severity.toUpperCase()}
        </Badge>
      </AlertTitle>
      <AlertDescription>
        <div className="space-y-2">
          <p><strong>{allergy.allergen}</strong> - {allergy.type} allergy</p>
          {allergy.reactions.length > 0 && (
            <p className="text-sm">
              <strong>Reactions:</strong> {allergy.reactions.map(r => r.type.replace('_', ' ')).join(', ')}
            </p>
          )}
          {alert && alert.recommendations.length > 0 && (
            <div className="text-sm">
              <strong>Clinical Recommendations:</strong>
              <ul className="list-disc pl-4 mt-1">
                {alert.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default AllergyAlert;
