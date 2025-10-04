import './App.css';
import { useState, useEffect } from 'react';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';

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

// Updated initial habits to include a 'completions' array for the CSV export requirement
const initialHabits = [
  { id: 1, name: 'Code daily', category: 'General', completions: ['2025-10-01', '2025-10-03'] },
  { id: 2, name: 'Read tech articles', category: 'General', completions: ['2025-10-02'] },
];

// A reusable helper function to trigger file downloads in the browser
const downloadFile = ({ data, fileName, fileType }) => {
  const blob = new Blob([data], { type: fileType });
  const a = document.createElement('a');
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  const clickEvt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  a.dispatchEvent(clickEvt);
  a.remove();
};

function App() {
  const [habits, setHabits] = useState(initialHabits);
  const [newHabit, setNewHabit] = useState({ name: '', category: 'General' });
  const categories = ['Coding', 'Learning', 'Project', 'Review', 'General'];

  console.log('Achievements:', achievements);

  // Calculate streak for a habit
  const calculateStreak = (habit) => {
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
  };

  // Check and award achievements for a habit
  const checkAndAwardAchievements = (habit) => {
    const streak = calculateStreak(habit);
    let newAchievements = [...habit.achievements];
    if (streak >= 7 && !newAchievements.includes('streak7')) {
      newAchievements.push('streak7');
      console.log(`Achievement unlocked for habit ${habit.name}: Novice Coder`);
    }
    if (streak >= 30 && !newAchievements.includes('streak30')) {
      newAchievements.push('streak30');
      console.log(`Achievement unlocked for habit ${habit.name}: Intermediate Coder`);
    }
    if (streak >= 100 && !newAchievements.includes('streak100')) {
      newAchievements.push('streak100');
      console.log(`Achievement unlocked for habit ${habit.name}: Expert Coder`);
    }
    // Add other achievement checks as needed
    return newAchievements;
  };

  const addHabit = () => {
    if (newHabit.name.trim() === '' || newHabit.category.trim() === '') {
      alert('Habit name and category cannot be empty'); // Use alert for better user feedback
      return;
    }
    const habitToAdd = { ...newHabit, id: Date.now(), completions: [] };
    setHabits([...habits, habitToAdd]);
    setNewHabit({ name: '', category: 'General' });
  };
  
  const exportJSON = (e) => {
    e.preventDefault();
    downloadFile({
      data: JSON.stringify(habits, null, 2),
      fileName: 'habits.json',
      fileType: 'application/json',
    });
  };
  
  const exportCSV = (e) => {
    e.preventDefault();
    let headers = ['id', 'name', 'category', 'completions'];
    const habitsCsv = habits.map(habit => {
      const completionsStr = `"${JSON.stringify(habit.completions)}"`;
      return [habit.id, habit.name, habit.category, completionsStr].join(',');
    });
    const csvData = [headers.join(','), ...habitsCsv].join('\n');
    downloadFile({
      data: csvData,
      fileName: 'habits.csv',
      fileType: 'text/csv',
    });
  };

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [calendarMode, setCalendarMode] = useState('90day'); // '90day' | 'weekly' | 'monthly'

  const filteredHabits = selectedCategory === 'All'
    ? habits
    : habits.filter(habit => habit.category === selectedCategory);

  // Calculate current week days
  const [currentWeekDays, setCurrentWeekDays] = useState([]);

  useEffect(() => {
    if (calendarMode === 'weekly') {
      const start = startOfWeek(new Date(), { weekStartsOn: 0 }); // Sunday
      const end = endOfWeek(new Date(), { weekStartsOn: 0 });
      setCurrentWeekDays(eachDayOfInterval({ start, end }));
    } else if (calendarMode === 'monthly') {
      const start = startOfMonth(new Date());
      const end = endOfMonth(new Date());
      const daysInMonth = eachDayOfInterval({ start, end });

      // Pad days to start on Sunday and end on Saturday
      const startPadding = start.getDay(); // 0 (Sun) to 6 (Sat)
      const endPadding = 6 - end.getDay();

      const paddedDays = [
        ...Array(startPadding).fill(null),
        ...daysInMonth,
        ...Array(endPadding).fill(null),
      ];

      setCurrentWeekDays(paddedDays);
    }
  }, [calendarMode]);

  // Toggle calendar mode handler
  const toggleCalendarMode = () => {
    setCalendarMode(prev => {
      if (prev === '90day') return 'weekly';
      if (prev === 'weekly') return 'monthly';
      return '90day';
    });
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
        updatedHabit.achievements = checkAndAwardAchievements(updatedHabit);
        return updatedHabit;
      });
    });
  };

  // UI handler to toggle completion on click
  const handleCompletionClick = (habitId, day) => {
    toggleCompletion(habitId, day);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Habit Tracker</h1>
      </header>

      <div className="form-container">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter a new habit..."
            value={newHabit.name}
            onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category"
            value={newHabit.category}
            onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
          />
        </div>
        <div className="actions-container">
          <button onClick={addHabit} className="btn-primary">Add Habit</button>
          <div className="export-buttons">
            <button onClick={exportJSON} className="btn-secondary">Export JSON</button>
            <button onClick={exportCSV} className="btn-secondary">Export CSV</button>
          </div>
        </div>
      </div>

      <div className="habits-list-container">
        <h3>Current Habits</h3>
        <ul>
          {habits.map((habit) => (
            <li key={habit.id} className="habit-item">
              <span className="habit-item-name">{habit.name}</span>
              <span className="habit-item-category">{habit.category}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;