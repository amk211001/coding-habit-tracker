import { useState } from 'react';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { checkAndAwardAchievements, calculateStreak } from './useAchievements';

export function useHabits(initialHabits) {
  const [habits, setHabits] = useState(initialHabits);

  // Calculate average completions per week over the last days
  const averageCompletion = (habit, days = 30) => {
    const endDate = new Date();
    const startDate = subDays(endDate, days);
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    let completionCount = 0;
    dateRange.forEach(day => {
      if (isCompletedOn(habit, day)) {
        completionCount++;
      }
    });
    const averagePerWeek = (completionCount / days) * 7;
    return averagePerWeek;
  };

  // Check if habit is completed on a given day
  const isCompletedOn = (habit, day) => {
    return habit.completions.some(date => format(date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
  };

  // Toggle completion for a habit on a day
  const toggleCompletion = (habitId, day) => {
    setHabits(prevHabits => {
      return prevHabits.map(habit => {
        if (habit.id !== habitId) return habit;
        const dayStr = format(day, 'yyyy-MM-dd');
        const hasCompleted = habit.completions.some(d => format(d, 'yyyy-MM-dd') === dayStr);
        let newCompletions;
        if (hasCompleted) {
          newCompletions = habit.completions.filter(d => format(d, 'yyyy-MM-dd') !== dayStr);
        } else {
          newCompletions = [...habit.completions, day];
        }
        const updatedHabit = { ...habit, completions: newCompletions };
        const { achievements: newAchievements } = checkAndAwardAchievements(updatedHabit);
        updatedHabit.achievements = newAchievements;
        // Note: Handling newly unlocked achievements should be done in the component using this hook
        return updatedHabit;
      });
    });
  };

  const addHabit = (newHabit) => {
    if (newHabit.category.trim() === '') {
      throw new Error('Category cannot be empty');
    }
    const habitToAdd = {
      ...newHabit,
      id: Date.now(),
      completions: [],
      achievements: [],
      reminderTime: newHabit.reminderTime || '',
    };
    setHabits(prev => [...prev, habitToAdd]);
  };

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  return {
    habits,
    setHabits,
    calculateStreak,
    averageCompletion,
    isCompletedOn,
    toggleCompletion,
    addHabit,
    deleteHabit,
  };
}
