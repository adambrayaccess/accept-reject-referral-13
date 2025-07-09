
import { useState } from 'react';
import { Referral } from '@/types/referral';
import { Table, TableBody } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import ReferralDetailModal from '@/components/modals/ReferralDetailModal';
import ReferralTableHeader from './ReferralTableHeader';
import ReferralTableRow from './ReferralTableRow';

interface ReferralListProps {
  referrals: Referral[];
  isLoading: boolean;
  isReordering?: boolean;
  filter?: (referral: Referral) => boolean;
  onReorder?: (sourceIndex: number, destinationIndex: number) => void;
  selectedIds?: Set<string>;
  onToggleSelection?: (referralId: string) => void;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  isAllSelected?: boolean;
  isIndeterminate?: boolean;
  onRefresh?: () => void;
}

const ReferralList = ({ 
  referrals, 
  isLoading, 
  isReordering = false,
  filter, 
  onReorder,
  selectedIds = new Set(),
  onToggleSelection,
  onSelectAll,
  isAllSelected = false,
  isIndeterminate = false,
  onRefresh
}: ReferralListProps) => {
  const [modalReferralId, setModalReferralId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const filteredReferrals = filter ? referrals.filter(filter) : referrals;

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onReorder || isReordering) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex !== destinationIndex) {
      onReorder(sourceIndex, destinationIndex);
    }
  };

  const handleNameClick = (e: React.MouseEvent, referralId: string) => {
    e.stopPropagation();
    setModalReferralId(referralId);
    setIsModalOpen(true);
  };

  const handleRowClick = (referralId: string) => {
    navigate(`/referral/${referralId}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalReferralId(null);
  };

  if (isLoading) {
    return (
      <div className="border rounded-lg bg-white">
        <div className="p-8 text-center">
          <div className="animate-pulse">Loading referrals...</div>
        </div>
      </div>
    );
  }

  if (filteredReferrals.length === 0) {
    return (
      <div className="border rounded-lg bg-white">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No referrals match your search criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg bg-white">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Table className="bg-white">
            <ReferralTableHeader 
              referrals={filteredReferrals}
              isAllSelected={isAllSelected}
              isIndeterminate={isIndeterminate}
              onSelectAll={onSelectAll}
            />
            <Droppable droppableId="referrals-list" isDropDisabled={isReordering}>
              {(provided, snapshot) => (
                <TableBody 
                  ref={provided.innerRef} 
                  {...provided.droppableProps}
                  className={isReordering ? 'opacity-70' : ''}
                >
                  {filteredReferrals.map((referral, index) => (
                    <ReferralTableRow
                      key={referral.id}
                      referral={referral}
                      index={index}
                      onNameClick={handleNameClick}
                      onRowClick={handleRowClick}
                      isDragDisabled={isReordering}
                      isSelected={selectedIds.has(referral.id)}
                      onToggleSelection={onToggleSelection}
                    />
                  ))}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </Table>
        </DragDropContext>
      </div>
      
      {isReordering && (
        <div className="text-center py-2">
          <div className="text-sm text-muted-foreground">Updating order...</div>
        </div>
      )}
      
      <ReferralDetailModal
        referralId={modalReferralId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default ReferralList;
