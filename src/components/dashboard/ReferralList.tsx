
import { useState } from 'react';
import { Referral } from '@/types/referral';
import { Table, TableBody } from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import ReferralDetailModal from '@/components/modals/ReferralDetailModal';
import ReferralTableHeader from './ReferralTableHeader';
import ReferralTableRow from './ReferralTableRow';

interface ReferralListProps {
  referrals: Referral[];
  isLoading: boolean;
  filter?: (referral: Referral) => boolean;
  onReorder?: (reorderedReferrals: Referral[]) => void;
}

const ReferralList = ({ referrals, isLoading, filter, onReorder }: ReferralListProps) => {
  const [modalReferralId, setModalReferralId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
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
    <>
      <div className="border rounded-lg overflow-hidden">
        <ScrollArea className="w-full">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Table className="min-w-[1400px]">
              <ReferralTableHeader />
              <Droppable droppableId="referrals-list">
                {(provided) => (
                  <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                    {filteredReferrals.map((referral, index) => (
                      <ReferralTableRow
                        key={referral.id}
                        referral={referral}
                        index={index}
                        onNameClick={handleNameClick}
                        onRowClick={handleRowClick}
                      />
                    ))}
                    {provided.placeholder}
                  </TableBody>
                )}
              </Droppable>
            </Table>
          </DragDropContext>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      
      <ReferralDetailModal
        referralId={modalReferralId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default ReferralList;
