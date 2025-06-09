
import { useState } from 'react';
import { Referral } from '@/types/referral';
import { Table, TableBody } from '@/components/ui/table';
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
}

const WaitingListTable = ({ 
  referrals, 
  isLoading, 
  selectedReferrals,
  onSelectReferral,
  onReorderReferrals
}: WaitingListTableProps) => {
  const [draggedItem, setDraggedItem] = useState<Referral | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  if (isLoading) {
    return <WaitingListLoadingState />;
  }

  if (referrals.length === 0) {
    return <WaitingListEmptyState />;
  }

  const handleDragStart = (e: React.DragEvent, referral: Referral) => {
    setDraggedItem(referral);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    const draggedIndex = referrals.findIndex(r => r.id === draggedItem.id);
    
    if (draggedIndex === dropIndex) {
      setDraggedItem(null);
      setDragOverIndex(null);
      return;
    }

    const newReferrals = [...referrals];
    newReferrals.splice(draggedIndex, 1);
    newReferrals.splice(dropIndex, 0, draggedItem);
    
    onReorderReferrals(newReferrals);
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <WaitingListTableHeader />
        <TableBody>
          {referrals.map((referral, index) => {
            const isSelected = selectedReferrals.some(r => r.id === referral.id);
            const isDraggedOver = dragOverIndex === index;
            const isDragging = draggedItem?.id === referral.id;

            return (
              <PatientTableRow
                key={referral.id}
                referral={referral}
                index={index}
                isSelected={isSelected}
                isDraggedOver={isDraggedOver}
                isDragging={isDragging}
                onSelectReferral={onSelectReferral}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default WaitingListTable;
