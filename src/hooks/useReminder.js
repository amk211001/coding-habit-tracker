
// Custom hook to check for habit reminders and show notification if not completed by set time
export function useReminder(habits, showReminder, permissionsGranted) {
  useEffect(() => {
    if (!permissionsGranted) return;
    // Check every hour for pending reminders
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
    }, 60 * 1000 * 60); // check every hour
    return () => clearInterval(interval);
  }, [habits, showReminder, permissionsGranted]);
}
