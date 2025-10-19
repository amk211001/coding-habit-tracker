/**
 * Calculates the total number of completion entries across all habits.
 * @param {Array} habits - The array of habit objects.
 * @returns {number} The total count of all completed days.
 */
export const totalCompletions = (habits) => {
  if (!habits) return 0;

  // Use reduce to sum the length of each habit's 'datesCompleted' array
  return habits.reduce((total, habit) => {
    const completions = habit.datesCompleted ? habit.datesCompleted.length : 0;
    return total + completions;
  }, 0);
};