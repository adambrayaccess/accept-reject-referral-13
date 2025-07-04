import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

interface WaitingListViewSkeletonProps {
  onBack: () => void;
}

const WaitingListViewSkeleton = ({ onBack }: WaitingListViewSkeletonProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader showSearch={false} />
      <div className="container py-3 space-y-4">
        <Button variant="ghost" onClick={onBack} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Waiting List
        </Button>
        
        <Skeleton className="w-full h-[400px] rounded-lg" />
        <Skeleton className="w-full h-[300px] rounded-lg" />
        <Skeleton className="w-full h-[100px] rounded-lg" />
      </div>
    </div>
  );
};

export default WaitingListViewSkeleton;