
// Custom hook to check for habit reminders and show notification if not completed by set time
import { useEffect } from 'react';
export function useReminder(habits, showReminder, permissionsGranted) {
  useEffect(() => {
    if (!permissionsGranted) return;
    // Check every minute for pending reminders (more reliable for dev testing)
    const interval = setInterval(() => {
      const now = new Date();
      habits.forEach(habit => {
        if (!habit.reminderTime) return;
        // Parse reminder time (HH:mm)
        const [reminderHour, reminderMinute] = habit.reminderTime.split(':').map(Number);
        // If current time matches reminder time
        if (now.getHours() === reminderHour && now.getMinutes() === reminderMinute) {
          // Only remind if not completed today
          const today = now.toISOString().slice(0, 10);
          const completedToday = habit.completions.some(date => {
            const d = typeof date === 'string' ? date : new Date(date).toISOString().slice(0, 10);
            return d === today;
          });
          if (!completedToday) {
            showReminder(habit);
          }
        }
      });
    }, 60 * 1000); // check every minute
    return () => clearInterval(interval);
  }, [habits, showReminder, permissionsGranted]);

  // Also inform the service worker about upcoming reminders so it can attempt to notify
  useEffect(() => {
    if (!permissionsGranted) {
      // Clear schedules if user revoked permissions
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_SCHEDULES' });
      }
      return;
    }
    if (!('serviceWorker' in navigator)) return;
    if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
      // Provide guidance in console to ensure permission is granted
      // eslint-disable-next-line no-console
      console.warn('[Reminders] Notification permission not granted. Use the Notification toggle to enable.');
      return;
    }

    const schedulePayload = [];
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    habits.forEach(habit => {
      if (!habit.reminderTime) return;
      // Only schedule if not completed today
      const completedToday = habit.completions.some(date => {
        const d = typeof date === 'string' ? date : new Date(date).toISOString().slice(0, 10);
        return d === todayStr;
      });
      if (completedToday) return;

      const [h, m] = habit.reminderTime.split(':').map(Number);
      const when = new Date();
      when.setHours(h, m, 0, 0);
      // If the time today already passed by more than a minute, skip (could schedule next day in future)
      if (when.getTime() < now.getTime() - 60 * 1000) return;

      schedulePayload.push({
        id: habit.id,
        when: when.getTime(),
        title: 'Habit Reminder',
        body: `Time to complete ${habit.name}`,
      });
    });

    // Log what we're about to schedule for visibility during testing
    // eslint-disable-next-line no-console
    console.log('[Reminders] Scheduling payload for SW:', schedulePayload);

    // Post to the active service worker if possible; otherwise try controller
    const postToSW = async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
        if (reg?.active) {
          reg.active.postMessage({ type: 'SCHEDULE_REMINDERS', payload: schedulePayload });
          return;
        }
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'SCHEDULE_REMINDERS', payload: schedulePayload });
        }
      } catch (e) {
        // no-op
      }
    };
    postToSW();
  }, [habits, permissionsGranted]);
}
