export const achievements = [
  { id: 'streak7', name: 'Novice Coder', condition: 'streak >= 7', icon: 'Award' },
  { id: 'streak30', name: 'Intermediate Coder', condition: 'streak >= 30', icon: 'Award' },
  { id: 'streak100', name: 'Expert Coder', condition: 'streak >= 100', icon: 'Award' },
  { id: 'firstHabit', name: 'Getting Started', condition: 'first habit added', icon: 'Star' },
  { id: 'fiveHabits', name: 'Habit Collector', condition: '5 habits added', icon: 'Star' },
  { id: 'categoryMaster', name: 'Category Master', condition: 'habits in all categories', icon: 'Medal' },
  { id: 'dailyCommit', name: 'Daily Committer', condition: 'commit every day for a week', icon: 'Award' },
  { id: 'weeklyWarrior', name: 'Weekly Warrior', condition: 'commit every day for a month', icon: 'Award' },
  { id: 'monthlyMarathon', name: 'Monthly Marathon', condition: 'commit every day for 3 months', icon: 'Award' },
  { id: 'reviewer', name: 'Code Reviewer', condition: 'review habit added', icon: 'Medal' },
];

export const categories = ['Coding', 'Learning', 'Project', 'Review', 'General'];

export const initialHabits = [
  { id: 1, name: 'Code daily', category: 'General', completions: Array.from({length: 7}, (_, i) => new Date(Date.now() - i * 24 * 60 * 60 * 1000)), achievements: ['streak7'] },
  { id: 2, name: 'Read tech articles', category: 'General', completions: [], achievements: [] },
];
