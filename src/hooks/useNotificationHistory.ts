import { useState, useEffect } from 'react';

export interface NotificationHistoryItem {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  timestamp: Date;
  read: boolean;
}

const MAX_HISTORY_SIZE = 50;

// Global notification history state
let notificationHistory: NotificationHistoryItem[] = [];
let historyListeners: Array<(history: NotificationHistoryItem[]) => void> = [];

function notifyHistoryListeners() {
  historyListeners.forEach(listener => listener([...notificationHistory]));
}

export function addToNotificationHistory(item: Omit<NotificationHistoryItem, 'timestamp' | 'read'>) {
  const newItem: NotificationHistoryItem = {
    ...item,
    timestamp: new Date(),
    read: false,
  };
  
  notificationHistory.unshift(newItem);
  
  // Keep only the most recent notifications
  if (notificationHistory.length > MAX_HISTORY_SIZE) {
    notificationHistory = notificationHistory.slice(0, MAX_HISTORY_SIZE);
  }
  
  notifyHistoryListeners();
}

export function markNotificationAsRead(id: string) {
  const notification = notificationHistory.find(n => n.id === id);
  if (notification) {
    notification.read = true;
    notifyHistoryListeners();
  }
}

export function markAllNotificationsAsRead() {
  notificationHistory.forEach(n => n.read = true);
  notifyHistoryListeners();
}

export function clearNotificationHistory() {
  notificationHistory = [];
  notifyHistoryListeners();
}

export function useNotificationHistory() {
  const [history, setHistory] = useState<NotificationHistoryItem[]>(notificationHistory);

  useEffect(() => {
    historyListeners.push(setHistory);
    return () => {
      const index = historyListeners.indexOf(setHistory);
      if (index > -1) {
        historyListeners.splice(index, 1);
      }
    };
  }, []);

  const unreadCount = history.filter(n => !n.read).length;

  return {
    history,
    unreadCount,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
    clearHistory: clearNotificationHistory,
  };
}
