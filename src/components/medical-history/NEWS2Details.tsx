
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
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 rounded-md border overflow-hidden bg-white">
        <div className="h-full overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/50 z-10">
              <TableRow>
                <TableHead className="w-[120px] py-2 px-3 text-xs font-medium">Date/Time</TableHead>
                <TableHead className="w-[60px] py-2 px-2 text-xs font-medium text-center">Resp</TableHead>
                <TableHead className="w-[60px] py-2 px-2 text-xs font-medium text-center">SpO2</TableHead>
                <TableHead className="w-[80px] py-2 px-2 text-xs font-medium text-center">BP</TableHead>
                <TableHead className="w-[60px] py-2 px-2 text-xs font-medium text-center">HR</TableHead>
                <TableHead className="w-[60px] py-2 px-2 text-xs font-medium text-center">Temp</TableHead>
                <TableHead className="w-[80px] py-2 px-2 text-xs font-medium text-center">NEWS2</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vitalSigns.map((vital, index) => {
                const isHighlighted = vital.timestamp === highlightRow;
                const riskCategory = getRiskCategory(vital.news2);
                
                return (
                  <TableRow 
                    key={vital.timestamp}
                    className={cn(
                      "hover:bg-muted/30 transition-colors",
                      isHighlighted && 'bg-primary/10 border-l-4 border-l-primary',
                      index % 2 === 0 && 'bg-muted/10'
                    )}
                  >
                    <TableCell className="py-2 px-3 text-xs font-mono">
                      {formatDetailDate(vital.timestamp)}
                    </TableCell>
                    <TableCell className="py-2 px-2 text-xs text-center font-medium">
                      {vital.respiration}
                    </TableCell>
                    <TableCell className="py-2 px-2 text-xs text-center font-medium">
                      {vital.oxygenSaturation}%
                    </TableCell>
                    <TableCell className="py-2 px-2 text-xs text-center font-medium">
                      <div className="flex flex-col leading-tight">
                        <span>{vital.bloodPressureSystolic}</span>
                        <span className="text-muted-foreground">/{vital.bloodPressureDiastolic}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 px-2 text-xs text-center font-medium">
                      {vital.heartRate}
                    </TableCell>
                    <TableCell className="py-2 px-2 text-xs text-center font-medium">
                      {vital.temperature}°C
                    </TableCell>
                    <TableCell className={cn("py-2 px-2 text-xs text-center font-bold", riskCategory.color)}>
                      <div className="flex flex-col items-center">
                        <span className="text-sm">{vital.news2}</span>
                        <span className="text-xs opacity-75">({riskCategory.category})</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {vitalSigns.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          No vital signs data available
        </div>
      )}
    </div>
  );
};
