
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Menu as MenuIcon, FileText, Users, BarChart3 } from 'lucide-react';

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: 'Referrals',
      path: '/',
      icon: FileText,
    },
    {
      name: 'Waiting Lists',
      path: '/cohort-builder',
      icon: Users,
    },
    {
      name: 'Analytics',
      path: '/admin',
      icon: BarChart3,
    },
  ];

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
          <MenuIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-48 bg-white border border-gray-200 shadow-lg z-50"
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <DropdownMenuItem
              key={item.path}
              onClick={() => handleMenuItemClick(item.path)}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{item.name}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Menu;
