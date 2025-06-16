
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SearchTablist = () => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
      {/* Search Section */}
      <div className="flex items-center gap-2 flex-1">
        <span className="text-sm font-medium text-gray-700">Search</span>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search NHS Number, Patient Name, UBRN, Unique reference no."
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchTablist;
