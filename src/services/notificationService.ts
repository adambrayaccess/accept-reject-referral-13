import { useToast } from '@/hooks/use-toast';

type NotificationType = 'new-referral' | 'referral-update' | 'error' | 'specialty-filter';

interface NotificationConfig {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

/**
 * Centralized notification service to manage toast notifications
 * Only shows notifications for approved scenarios:
 * 1. New referrals imported
 * 2. Referral updates 
 * 3. Error messages
 * 4. Specialty filter changes
 */
export class NotificationService {
  private static toastFunction: ReturnType<typeof useToast>['toast'] | null = null;

  static init(toast: ReturnType<typeof useToast>['toast']) {
    this.toastFunction = toast;
  }

  static showNotification(type: NotificationType, config: NotificationConfig) {
    if (!this.toastFunction) {
      console.warn('NotificationService not initialized');
      return;
    }

    // Only show notifications for approved types
    const allowedTypes: NotificationType[] = ['new-referral', 'referral-update', 'error', 'specialty-filter'];
    
    if (!allowedTypes.includes(type)) {
      console.debug(`Notification type '${type}' not allowed. Skipping.`);
      return;
    }

    this.toastFunction({
      title: config.title,
      description: config.description,
      variant: config.variant || 'default',
      duration: config.duration || 5000,
    });
  }

  static showError(title: string, description: string) {
    this.showNotification('error', {
      title,
      description,
      variant: 'destructive',
    });
  }

  static showSpecialtyFilterChange(specialties: string[]) {
    this.showNotification('specialty-filter', {
      title: "Specialties Updated",
      description: `Now triaging for ${specialties.length === 1 ? specialties[0] : `${specialties.length} specialties`}`,
    });
  }

  // Helper method to check if a notification should be shown
  static shouldShowNotification(type: NotificationType): boolean {
    const allowedTypes: NotificationType[] = ['new-referral', 'referral-update', 'error', 'specialty-filter'];
    return allowedTypes.includes(type);
  }
}

/**
 * Hook to initialize and use the notification service
 */
export const useNotificationService = () => {
  const { toast } = useToast();
  
  // Initialize the service with the toast function
  NotificationService.init(toast);

  return {
    showError: NotificationService.showError,
    showSpecialtyFilterChange: NotificationService.showSpecialtyFilterChange,
    showNotification: NotificationService.showNotification,
  };
};