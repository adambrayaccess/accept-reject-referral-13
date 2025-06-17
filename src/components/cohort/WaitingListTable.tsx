
import { useState } from 'react';
import { Referral } from '@/types/referral';
import { Table, TableBody } from '@/components/ui/table';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useToast } from '@/hooks/use-toast';
import WaitingListTableHeader from './WaitingListTableHeader';
import PatientTableRow from './PatientTableRow';
import WaitingListLoadingState from './WaitingListLoadingState';
import WaitingListEmptyState from './WaitingListEmptyState';
import ReferralDetailModal from '@/components/modals/ReferralDetailModal';
import { reorderReferrals } from '@/services/referral/referralReorderService';

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
  const [selectedReferralId, setSelectedReferralId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  if (isLoading) {
    return <WaitingListLoadingState />;
  }

  if (referrals.length === 0) {
    return <WaitingListEmptyState />;
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || isReordering) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex !== destinationIndex) {
      setIsReordering(true);
      
      // Optimistic update - immediately update the UI
      const optimisticReferrals = [...referrals];
      const [removed] = optimisticReferrals.splice(sourceIndex, 1);
      optimisticReferrals.splice(destinationIndex, 0, removed);
      
      // Update the parent component immediately for responsive UI
      onReorderReferrals(optimisticReferrals);
      
      console.log(`Attempting to reorder: moving "${removed.patient.name}" from ${sourceIndex} to ${destinationIndex}`);
      
      try {
        // Call the reorder service
        const response = await reorderReferrals(
          referrals,
          sourceIndex,
          destinationIndex,
          {
            specialty: referrals[0]?.specialty,
            filter: 'waiting-list',
            sortField: 'displayOrder'
          }
        );
        
        if (response.success) {
          console.log('Reorder successful, updating with server response');
          onReorderReferrals(response.updatedReferrals);
          
          toast({
            title: 'Order Updated',
            description: `Moved "${removed.patient.name}" to position ${destinationIndex + 1}`,
          });
        } else {
          console.error('Reorder failed:', response.error);
          // Rollback to original order
          onReorderReferrals(referrals);
          
          toast({
            title: 'Update Failed',
            description: response.error || 'Failed to update order. Please try again.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error during reorder:', error);
        // Rollback to original order
        onReorderReferrals(referrals);
        
        toast({
          title: 'Update Failed',
          description: 'Failed to update order. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsReordering(false);
      }
    }
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      onClearSelection?.();
    } else {
      onSelectAll?.();
    }
  };

  const handleRowClick = (referral: Referral) => {
    setSelectedReferralId(referral.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReferralId(null);
  };

  return (
    <>
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
                        onRowClick={handleRowClick}
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
          <div className="text-center py-3 bg-blue-50 border-t">
            <div className="text-sm text-blue-600 font-medium">Updating order...</div>
          </div>
        )}
      </div>

      <ReferralDetailModal
        referralId={selectedReferralId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default WaitingListTable;
