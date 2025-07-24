
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Menu from './Menu';

import NotificationDropdown from './NotificationDropdown';

interface PageHeaderProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
}

const PageHeader = ({ searchValue = '', onSearchChange, showSearch = true }: PageHeaderProps) => {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Menu />
          <img 
            src="/lovable-uploads/0f45d382-0710-437a-a400-96e464c8e502.png" 
            alt="Logo" 
            className="w-8 h-8 rounded-full object-cover"
          />
          <h1 className="text-xl font-semibold text-gray-900">Access Referral Triage Management</h1>
        </div>
        
        {showSearch && (
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search Patients"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-10 w-64 bg-white text-gray-900 placeholder-gray-500 border-gray-300 focus:border-teal-500"
              />
            </div>
            <NotificationDropdown />
          </div>
        )}
        
        {!showSearch && (
          <div className="flex items-center gap-4">
            <NotificationDropdown />
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
