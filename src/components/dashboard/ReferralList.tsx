
import { Referral } from '@/types/referral';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface ReferralListProps {
  referrals: Referral[];
  isLoading: boolean;
  filter?: (referral: Referral) => boolean;
}

const getPriorityVariant = (priority: Referral['priority']) => {
  switch (priority) {
    case 'emergency':
      return 'destructive';
    case 'urgent':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'new':
      return 'default';
    case 'accepted':
      return 'secondary';
    case 'rejected':
      return 'destructive';
    case 'pre-assessment':
      return 'outline';
    case 'assessed':
      return 'secondary';
    case 'waiting-list':
      return 'outline';
    default:
      return 'outline';
  }
};

const getStatusText = (referral: Referral) => {
  if (referral.status === 'accepted' && referral.triageStatus) {
    switch (referral.triageStatus) {
      case 'pre-assessment':
        return 'Pre-Assess';
      case 'assessed':
        return 'Assessed';
      case 'waiting-list':
        return 'Waiting List';
      case 'refer-to-another-specialty':
        return 'Refer on';
      default:
        return referral.triageStatus;
    }
  }
  return referral.status.charAt(0).toUpperCase() + referral.status.slice(1);
};

const ReferralList = ({ referrals, isLoading, filter }: ReferralListProps) => {
  const filteredReferrals = filter ? referrals.filter(filter) : referrals;

  if (isLoading) {
    return (
      <div className="border rounded-lg">
        <div className="p-8 text-center">
          <div className="animate-pulse">Loading referrals...</div>
        </div>
      </div>
    );
  }

  if (filteredReferrals.length === 0) {
    return (
      <div className="border rounded-lg">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No referrals match your search criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Priority</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>NHS Number</TableHead>
            <TableHead>Referral Date and time</TableHead>
            <TableHead>Contact Number</TableHead>
            <TableHead>HCP referred to</TableHead>
            <TableHead>Reason for referral</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Source</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReferrals.map((referral) => (
            <TableRow key={referral.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={getPriorityVariant(referral.priority)}
                    className={referral.priority === 'urgent' ? 'bg-[#973060] text-white hover:bg-[#973060]/80' : ''}
                  >
                    {referral.priority.charAt(0).toUpperCase() + referral.priority.slice(1)}
                  </Badge>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
              </TableCell>
              <TableCell>
                <Link 
                  to={`/referral/${referral.id}`}
                  className="font-medium hover:underline text-blue-600"
                >
                  {referral.patient.name}
                </Link>
              </TableCell>
              <TableCell>{referral.patient.gender}</TableCell>
              <TableCell className="font-mono text-sm">{referral.patient.nhsNumber}</TableCell>
              <TableCell className="text-sm">
                <div>{format(new Date(referral.created), 'dd MMM yyyy')}</div>
                <div>{format(new Date(referral.created), 'HH:mm')}</div>
              </TableCell>
              <TableCell className="font-mono text-sm">{referral.patient.phone || 'N/A'}</TableCell>
              <TableCell>
                <div>{referral.specialty}</div>
                <div className="text-sm text-muted-foreground">{referral.referrer.name}</div>
              </TableCell>
              <TableCell className="max-w-48">
                <div className="text-sm truncate" title={referral.clinicalInfo.reason}>
                  {referral.clinicalInfo.reason}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(getStatusText(referral))}>
                  {getStatusText(referral)}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Source
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReferralList;
