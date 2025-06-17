
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';
import Titlebar from '@/components/Titlebar';
import PageHeader from '@/components/PageHeader';

interface AdminPageSkeletonProps {
  onBack: () => void;
}

const AdminPageSkeleton = ({ onBack }: AdminPageSkeletonProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Titlebar />
      <PageHeader showSearch={false} />
      
      <div className="px-6 py-6 space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-80" />
            <Skeleton className="h-4 w-96" />
            <Skeleton className="h-3 w-64" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* AI Copilot skeleton */}
        <Skeleton className="h-48 w-full rounded-lg" />

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>

        {/* Specialty breakdown skeleton */}
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    </div>
  );
};

export default AdminPageSkeleton;
