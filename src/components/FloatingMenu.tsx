
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  FileText,
  MessageSquare,
  CalendarPlus 
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'patients', label: 'Patients', icon: Users, path: '/patients' },
  { id: 'appointments', label: 'Appointments', icon: Calendar, path: '/appointments' },
  { id: 'schedule', label: 'Schedule', icon: CalendarPlus, path: '/schedule' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages' },
  { id: 'documents', label: 'Documents', icon: FileText, path: '/documents' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

const FloatingMenu = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleItemClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={cn(
      "fixed left-4 top-1/2 transform -translate-y-1/2 z-50",
      "lg:relative lg:left-0 lg:top-0 lg:transform-none lg:h-screen lg:pt-4"
    )}>
      <div
        className={cn(
          "bg-white shadow-2xl rounded-2xl border border-gray-200 transition-all duration-300 ease-in-out",
          "lg:h-full lg:flex lg:flex-col lg:justify-start",
          isExpanded ? "w-64 p-4" : "w-16 p-3"
        )}
        onMouseEnter={() => !isMobile && setIsExpanded(true)}
        onMouseLeave={() => !isMobile && setIsExpanded(false)}
      >
        {/* Mobile toggle button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-2 -top-2 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-lg lg:hidden"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <LayoutDashboard className="h-4 w-4" />
          </Button>
        )}

        {/* Header with logo/brand */}
        <div className={cn(
          "flex items-center mb-4",
          isExpanded ? "justify-start" : "justify-center"
        )}>
          <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          {isExpanded && (
            <div className="ml-3">
              <h2 className="text-sm font-semibold text-gray-800">Medical Hub</h2>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full transition-all duration-200",
                  isExpanded ? "justify-start h-10 px-3" : "justify-center h-10 w-10 px-0",
                  active 
                    ? "bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
                onClick={() => handleItemClick(item.path)}
                aria-label={item.label}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  active ? "text-teal-600" : "text-gray-500"
                )} />
                {isExpanded && (
                  <span className="ml-3 text-sm font-medium truncate">
                    {item.label}
                  </span>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Footer indicator */}
        {isExpanded && !isMobile && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-400 text-center">
              Hover to collapse
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingMenu;
