import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

interface WaitingListViewNotFoundProps {
  onBack: () => void;
}

const WaitingListViewNotFound = ({ onBack }: WaitingListViewNotFoundProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader showSearch={false} />
      <div className="container py-3">
        <Button variant="ghost" onClick={onBack} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Waiting List
        </Button>
        
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-bold mb-2">Referral Not Found</h2>
          <p className="text-muted-foreground mb-6">The referral you're looking for doesn't exist or has been removed.</p>
          <Button onClick={onBack}>Return to Waiting List</Button>
        </div>
      </div>
    </div>
  );
};

export default WaitingListViewNotFound;