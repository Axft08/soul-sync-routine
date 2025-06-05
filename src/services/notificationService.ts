
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export interface NotificationOptions {
  id: number;
  title: string;
  body: string;
  schedule?: {
    at: Date;
    repeats?: boolean;
  };
  sound?: string;
  vibrate?: boolean;
}

class NotificationService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Request notification permissions
      const permission = await LocalNotifications.requestPermissions();
      
      if (permission.display === 'granted') {
        console.log('Notification permissions granted');
        this.isInitialized = true;
      } else {
        console.warn('Notification permissions denied');
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  async scheduleNotification(options: NotificationOptions) {
    await this.initialize();

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: options.id,
            title: options.title,
            body: options.body,
            schedule: options.schedule,
            sound: options.sound || 'default',
            actionTypeId: 'TASK_REMINDER',
            extra: {
              vibrate: options.vibrate || true
            }
          }
        ]
      });

      console.log(`Notification scheduled: ${options.title}`);
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  async scheduleTaskReminder(taskId: string, taskName: string, time: string, motivationalMessage: string) {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduleTime = new Date();
    scheduleTime.setHours(hours, minutes, 0, 0);

    // If the time has passed for today, schedule for tomorrow
    if (scheduleTime <= now) {
      scheduleTime.setDate(scheduleTime.getDate() + 1);
    }

    await this.scheduleNotification({
      id: parseInt(taskId),
      title: `⏰ Time for ${taskName}!`,
      body: motivationalMessage,
      schedule: {
        at: scheduleTime,
        repeats: true
      },
      sound: 'default',
      vibrate: true
    });
  }

  async scheduleWaterReminder() {
    const now = new Date();
    const reminderTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now

    await this.scheduleNotification({
      id: 9999,
      title: '💧 Hydration Time!',
      body: 'Remember to drink water - your body needs it!',
      schedule: {
        at: reminderTime,
        repeats: true
      },
      sound: 'default',
      vibrate: true
    });
  }

  async cancelNotification(id: number) {
    try {
      await LocalNotifications.cancel({
        notifications: [{ id: id }]
      });
      console.log(`Notification ${id} cancelled`);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  async cancelAllNotifications() {
    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({
          notifications: pending.notifications.map(n => ({ id: n.id }))
        });
      }
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  async triggerHaptic(style: ImpactStyle = ImpactStyle.Medium) {
    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.error('Error triggering haptic feedback:', error);
    }
  }
}

export const notificationService = new NotificationService();
