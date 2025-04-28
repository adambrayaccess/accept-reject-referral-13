
import { VitalSign } from '@/types/referral';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDetailDate } from '../utils/dateUtils';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface NEWS2DetailsProps {
  vitalSigns: VitalSign[];
  highlightRow?: string;
}

// Helper function to calculate NEWS2 risk category
const getRiskCategory = (score: number): { category: string; color: string } => {
  if (score >= 7) return { category: 'High', color: 'text-red-500' };
  if (score >= 5) return { category: 'Medium', color: 'text-amber-500' };
  return { category: 'Low', color: 'text-green-500' };
};

export const NEWS2Details = ({ vitalSigns, highlightRow }: NEWS2DetailsProps) => {
  const [showAll, setShowAll] = useState(false);

  // Always show the highlighted row if it exists, otherwise the latest rows
  const displayVitalSigns = vitalSigns.slice(0, 2);
  const hasMoreData = vitalSigns.length > 2;

  return (
    <div className="rounded-md border overflow-hidden text-xs">
      <div className="overflow-x-auto">
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
            {displayVitalSigns.map((vital) => {
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
      
      {hasMoreData && (
        <div className="flex justify-end p-1">
          <Dialog open={showAll} onOpenChange={setShowAll}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs h-6 px-2">View All</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>All Vital Sign Observations</DialogTitle>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Respiration</TableHead>
                      <TableHead>SpO2</TableHead>
                      <TableHead>Blood Pressure</TableHead>
                      <TableHead>Heart Rate</TableHead>
                      <TableHead>Temperature</TableHead>
                      <TableHead>NEWS2 Score</TableHead>
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
                            isHighlighted && 'bg-primary/10'
                          )}
                        >
                          <TableCell className="font-medium">{formatDetailDate(vital.timestamp)}</TableCell>
                          <TableCell>{vital.respiration} /min</TableCell>
                          <TableCell>{vital.oxygenSaturation}%</TableCell>
                          <TableCell>{vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}</TableCell>
                          <TableCell>{vital.heartRate} bpm</TableCell>
                          <TableCell>{vital.temperature}°C</TableCell>
                          <TableCell className={riskCategory.color}>
                            {vital.news2} ({riskCategory.category})
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};
