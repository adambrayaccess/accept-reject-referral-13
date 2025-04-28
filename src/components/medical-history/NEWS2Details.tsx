
import { VitalSign } from '@/types/referral';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDetailDate } from './utils/dateUtils';
import { cn } from '@/lib/utils';

interface NEWS2DetailsProps {
  vitalSigns: VitalSign[];
  highlightRow?: string;
}

const getRiskCategory = (score: number): { category: string; color: string } => {
  if (score >= 7) return { category: 'High', color: 'text-red-500' };
  if (score >= 5) return { category: 'Medium', color: 'text-amber-500' };
  return { category: 'Low', color: 'text-green-500' };
};

export const NEWS2Details = ({ vitalSigns, highlightRow }: NEWS2DetailsProps) => {
  return (
    <div className="rounded-md border h-[400px] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="py-1 px-2">Date/Time</TableHead>
            <TableHead className="py-1 px-2">Resp</TableHead>
            <TableHead className="py-1 px-2">SpO2</TableHead>
            <TableHead className="py-1 px-2">BP</TableHead>
            <TableHead className="py-1 px-2">HR</TableHead>
            <TableHead className="py-1 px-2">Temp</TableHead>
            <TableHead className="py-1 px-2">NEWS2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vitalSigns.map((vital) => {
            const isHighlighted = vital.timestamp === highlightRow;
            const riskCategory = getRiskCategory(vital.news2);
            
            return (
              <TableRow 
                key={vital.timestamp}
                className={cn(
                  "h-8",
                  isHighlighted && 'bg-primary/10'
                )}
              >
                <TableCell className="py-1 px-2 font-medium">{formatDetailDate(vital.timestamp)}</TableCell>
                <TableCell className="py-1 px-2">{vital.respiration}</TableCell>
                <TableCell className="py-1 px-2">{vital.oxygenSaturation}%</TableCell>
                <TableCell className="py-1 px-2">{vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}</TableCell>
                <TableCell className="py-1 px-2">{vital.heartRate}</TableCell>
                <TableCell className="py-1 px-2">{vital.temperature}°C</TableCell>
                <TableCell className={cn("py-1 px-2", riskCategory.color)}>
                  {vital.news2} ({riskCategory.category})
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
