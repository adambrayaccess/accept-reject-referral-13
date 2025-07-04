import React from 'react';
import { Bell, BellDot, Trash2, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotificationHistory } from '@/hooks/useNotificationHistory';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = () => {
  const { history, unreadCount, markAsRead, markAllAsRead, clearHistory } = useNotificationHistory();
  const navigate = useNavigate();

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return format(date, 'MMM d, HH:mm');
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.referralId) {
      navigate(`/referral/${notification.referralId}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-8 h-8 relative">
          {unreadCount > 0 ? (
            <BellDot className="w-4 h-4 text-gray-600" />
          ) : (
            <Bell className="w-4 h-4 text-gray-600" />
          )}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs min-w-0"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <h3 className="font-medium text-sm">Notifications</h3>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-6 px-2 text-xs"
              >
                <Check className="w-3 h-3 mr-1" />
                Mark all read
              </Button>
            )}
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="h-6 px-2 text-xs text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        {history.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          <ScrollArea className="max-h-96">
            <div className="p-1">
              {history.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative p-3 rounded-md mb-1 cursor-pointer transition-colors ${
                    notification.read 
                      ? 'hover:bg-muted/50' 
                      : 'bg-accent/30 hover:bg-accent/50'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {notification.title && (
                        <p className={`text-sm font-medium mb-1 ${
                          notification.variant === 'destructive' ? 'text-destructive' : ''
                        }`}>
                          {notification.title}
                        </p>
                      )}
                      {notification.description && (
                        <p className="text-xs text-muted-foreground mb-2 break-words">
                          {notification.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                        {notification.referralId && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View Referral
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {!notification.read && (
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;