import { useEffect } from 'react';

export function useReminder(habits, showReminder, permissionsGranted) {
  useEffect(() => {
    if (!permissionsGranted) return;
    const interval = setInterval(() => {
      const now = new Date();
      habits.forEach(habit => {
        if (!habit.reminderTime) return;
        const [reminderHour, reminderMinute] = habit.reminderTime.split(':').map(Number);
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
    }, 60 * 1000 * 60); // check every hour
    return () => clearInterval(interval);
  }, [habits, showReminder, permissionsGranted]);
}
