
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PageHeaderProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
}

const PageHeader = ({ searchValue = '', onSearchChange, showSearch = true }: PageHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <div className="w-5 h-5 bg-white rounded-full"></div>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Access Referral Triage Management</h1>
        </div>
        
        {showSearch && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search Patients"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-10 w-64 bg-teal-600 text-white placeholder-teal-200 border-teal-600 focus:border-teal-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
