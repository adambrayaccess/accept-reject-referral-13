
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Users, UserPlus } from 'lucide-react';

const SearchTablist = () => {
  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-lg border">
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

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button 
          className="bg-[#007A7A] hover:bg-[#007A7A]/90 text-white flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          Auto-book appointments
        </Button>
        
        <Button 
          className="bg-[#007A7A] hover:bg-[#007A7A]/90 text-white flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Auto add a patient to a waiting list
        </Button>
      </div>
    </div>
  );
};

export default SearchTablist;
