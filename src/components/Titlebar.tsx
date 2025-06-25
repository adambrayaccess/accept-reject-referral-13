
import React, { useState } from 'react';
import { Bell, Plus, HelpCircle, User, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from './auth/AuthModal';

const Titlebar = () => {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 h-12">
      {/* Left side - Access logo/brand */}
      <div className="flex items-center gap-2">
        <img 
          src="/lovable-uploads/897bfd6c-1a53-4aeb-a0a0-2d75a3693b6f.png" 
          alt="Access Logo" 
          className="h-8 object-contain"
        />
      </div>

      {/* Right side - Navigation icons and user profile */}
      <div className="flex items-center gap-3">
        {/* Navigation icons */}
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <Bell className="w-4 h-4 text-gray-600" />
        </Button>
        
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <Plus className="w-4 h-4 text-gray-600" />
        </Button>
        
        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs text-gray-600">?</span>
          </div>
        </Button>
        
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <HelpCircle className="w-4 h-4 text-gray-600" />
        </Button>

        {/* User profile dropdown */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 py-1 h-8">
                <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-gray-700">{user.email}</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAuthModal(true)}
          >
            Login
          </Button>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Titlebar;
