
import { useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { Task } from '../components/Dashboard';

interface UseNotificationsProps {
  tasks: Task[];
  waterIntake: number;
  enableNotifications: boolean;
}

export const useNotifications = ({ tasks, waterIntake, enableNotifications }: UseNotificationsProps) => {
  
  useEffect(() => {
    if (!enableNotifications) return;

    const setupNotifications = async () => {
      // Initialize notification service
      await notificationService.initialize();

      // Cancel existing notifications
      await notificationService.cancelAllNotifications();

      // Schedule task reminders
      tasks.forEach(async (task) => {
        if (!task.completed) {
          await notificationService.scheduleTaskReminder(
            task.id,
            task.name,
            task.time,
            task.motivationalMessage
          );
        }
      });

      // Schedule water reminders every 2 hours
      if (waterIntake < 4) {
        await notificationService.scheduleWaterReminder();
      }
    };

    setupNotifications();
  }, [tasks, waterIntake, enableNotifications]);

  const scheduleCustomReminder = async (title: string, body: string, time: Date) => {
    if (!enableNotifications) return;
    
    await notificationService.scheduleNotification({
      id: Date.now(), // Use timestamp as unique ID
      title,
      body,
      schedule: { at: time },
      vibrate: true
    });
  };

  const triggerHapticFeedback = async () => {
    await notificationService.triggerHaptic();
  };

  return {
    scheduleCustomReminder,
    triggerHapticFeedback
  };
};
