
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

interface NEWS2DetailsProps {
  vitalSigns: VitalSign[];
}

export const NEWS2Details = ({ vitalSigns }: NEWS2DetailsProps) => {
  const latestVitalSigns = [...vitalSigns].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 5);

  return (
    <div className="rounded-md border">
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
          {latestVitalSigns.map((vital) => (
            <TableRow key={vital.timestamp}>
              <TableCell>{formatDetailDate(vital.timestamp)}</TableCell>
              <TableCell>{vital.respiration} /min</TableCell>
              <TableCell>{vital.oxygenSaturation}%</TableCell>
              <TableCell>{vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}</TableCell>
              <TableCell>{vital.heartRate} bpm</TableCell>
              <TableCell>{vital.temperature}°C</TableCell>
              <TableCell>{vital.news2}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
