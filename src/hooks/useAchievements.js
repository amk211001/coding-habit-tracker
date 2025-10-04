import { achievements } from '../constants';

// Calculate streak for a habit
export function calculateStreak(habit) {
  if (!habit.completions.length) return 0;
  const sortedDates = habit.completions
    .map(d => new Date(d))
    .sort((a, b) => b - a);
  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const diff = (sortedDates[i - 1] - sortedDates[i]) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

// Check and award achievements for a habit
export function checkAndAwardAchievements(habit) {
  const streak = calculateStreak(habit);
  let newAchievements = [...habit.achievements];
  let newUnlocked = [];

  if (streak >= 7 && !newAchievements.includes('streak7')) {
    newAchievements.push('streak7');
    newUnlocked.push('streak7');
  }
  if (streak >= 30 && !newAchievements.includes('streak30')) {
    newAchievements.push('streak30');
    newUnlocked.push('streak30');
  }
  if (streak >= 100 && !newAchievements.includes('streak100')) {
    newAchievements.push('streak100');
    newUnlocked.push('streak100');
  }
  // Add other achievement checks as needed

  return { achievements: newAchievements, newUnlocked };
}
