import { Referral } from '@/types/referral';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface ReferralListProps {
  referrals: Referral[];
  isLoading: boolean;
  filter?: (referral: Referral) => boolean;
  onReorder?: (reorderedReferrals: Referral[]) => void;
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

const getStatusClass = (status: Referral['status']) => {
  return `status-${status}`;
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

const getSourceText = (referral: Referral) => {
  // Based on referrer organization or default to GP
  if (referral.referrer.organization) {
    if (referral.referrer.organization.toLowerCase().includes('hospital')) {
      return 'Hospital';
    }
    if (referral.referrer.organization.toLowerCase().includes('clinic')) {
      return 'Clinic';
    }
    if (referral.referrer.organization.toLowerCase().includes('emergency')) {
      return 'A&E';
    }
  }
  return 'GP';
};

const ReferralList = ({ referrals, isLoading, filter, onReorder }: ReferralListProps) => {
  const filteredReferrals = filter ? referrals.filter(filter) : referrals;

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onReorder) {
      return;
    }

    const items = Array.from(filteredReferrals);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

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
      <DragDropContext onDragEnd={handleDragEnd}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-20">Priority</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>NHS Number</TableHead>
              <TableHead>UBRN</TableHead>
              <TableHead>Referral Date and time</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>HCP referred to</TableHead>
              <TableHead>Reason for referral</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <Droppable droppableId="referrals-list">
            {(provided) => (
              <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                {filteredReferrals.map((referral, index) => (
                  <Draggable key={referral.id} draggableId={referral.id} index={index}>
                    {(provided, snapshot) => (
                      <TableRow 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`hover:bg-muted/50 ${
                          snapshot.isDragging ? 'bg-muted shadow-lg' : ''
                        }`}
                      >
                        <TableCell>
                          <div 
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </TableCell>
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
                        <TableCell className="font-mono text-sm">{referral.ubrn}</TableCell>
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
                          <span className={getStatusClass(referral.status)}>
                            {getStatusText(referral).toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline">
                              {getSourceText(referral)}
                            </Badge>
                            <div className="text-sm text-muted-foreground">
                              {referral.referrer.organization || 'N/A'}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            )}
          </Droppable>
        </Table>
      </DragDropContext>
    </div>
  );
};

export default ReferralList;
