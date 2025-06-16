
import { useState } from 'react';
import { Referral } from '@/types/referral';
import { Table, TableBody } from '@/components/ui/table';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import WaitingListTableHeader from './WaitingListTableHeader';
import PatientTableRow from './PatientTableRow';
import WaitingListLoadingState from './WaitingListLoadingState';
import WaitingListEmptyState from './WaitingListEmptyState';

interface WaitingListTableProps {
  referrals: Referral[];
  isLoading: boolean;
  selectedReferrals: Referral[];
  onSelectReferral: (referral: Referral) => void;
  onReorderReferrals: (reorderedReferrals: Referral[]) => void;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  isAllSelected?: boolean;
  isIndeterminate?: boolean;
}

const WaitingListTable = ({ 
  referrals, 
  isLoading, 
  selectedReferrals,
  onSelectReferral,
  onReorderReferrals,
  onSelectAll,
  onClearSelection,
  isAllSelected = false,
  isIndeterminate = false
}: WaitingListTableProps) => {
  const [isReordering, setIsReordering] = useState(false);

  if (isLoading) {
    return <WaitingListLoadingState />;
  }

  if (referrals.length === 0) {
    return <WaitingListEmptyState />;
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || isReordering) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex !== destinationIndex) {
      setIsReordering(true);
      const newReferrals = [...referrals];
      const [removed] = newReferrals.splice(sourceIndex, 1);
      newReferrals.splice(destinationIndex, 0, removed);
      
      onReorderReferrals(newReferrals);
      
      // Reset reordering state after a delay
      setTimeout(() => setIsReordering(false), 500);
    }
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      onClearSelection?.();
    } else {
      onSelectAll?.();
    }
  };

  return (
    <div className="border rounded-lg">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Table>
          <WaitingListTableHeader 
            referrals={referrals}
            isAllSelected={isAllSelected}
            isIndeterminate={isIndeterminate}
            onSelectAll={handleSelectAll}
          />
          <Droppable droppableId="waiting-list" isDropDisabled={isReordering}>
            {(provided, snapshot) => (
              <TableBody 
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={isReordering ? 'opacity-70' : ''}
              >
                {referrals.map((referral, index) => {
                  const isSelected = selectedReferrals.some(r => r.id === referral.id);

                  return (
                    <PatientTableRow
                      key={referral.id}
                      referral={referral}
                      index={index}
                      isSelected={isSelected}
                      onSelectReferral={onSelectReferral}
                      isDragDisabled={isReordering}
                    />
                  );
                })}
                {provided.placeholder}
              </TableBody>
            )}
          </Droppable>
        </Table>
      </DragDropContext>
      
      {isReordering && (
        <div className="text-center py-2">
          <div className="text-sm text-muted-foreground">Updating order...</div>
        </div>
      )}
    </div>
  );
};

export default WaitingListTable;
