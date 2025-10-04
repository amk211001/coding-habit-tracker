import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import subWeeks from 'date-fns/subWeeks';
import addWeeks from 'date-fns/addWeeks';
import subMonths from 'date-fns/subMonths';
import addMonths from 'date-fns/addMonths';
import subDays from 'date-fns/subDays';
import { useSwipeable } from 'react-swipeable';
import { Award, Star, Medal, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

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

const initialHabits = [
  { id: 1, name: 'Code daily', category: 'General', completions: Array.from({length: 7}, (_, i) => new Date(Date.now() - i * 24 * 60 * 60 * 1000)), achievements: ['streak7'] },
  { id: 2, name: 'Read tech articles', category: 'General', completions: [], achievements: [] },
];

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

  // Check and award achievements for a habit
  const checkAndAwardAchievements = (habit) => {
    const streak = calculateStreak(habit);
    let newAchievements = [...habit.achievements];
    let newUnlocked = [];
    if (streak >= 7 && !newAchievements.includes('streak7')) {
      newAchievements.push('streak7');
      newUnlocked.push('streak7');
      console.log(`Achievement unlocked for habit ${habit.name}: Novice Coder`);
    }
    if (streak >= 30 && !newAchievements.includes('streak30')) {
      newAchievements.push('streak30');
      newUnlocked.push('streak30');
      console.log(`Achievement unlocked for habit ${habit.name}: Intermediate Coder`);
    }
    if (streak >= 100 && !newAchievements.includes('streak100')) {
      newAchievements.push('streak100');
      newUnlocked.push('streak100');
      console.log(`Achievement unlocked for habit ${habit.name}: Expert Coder`);
    }
    // Add other achievement checks as needed
    return { achievements: newAchievements, newUnlocked };
  };

  const addHabit = () => {
    if (newHabit.category.trim() === '') {
      console.error('Category cannot be empty');
      return;
    }
    const habitToAdd = { ...newHabit, id: Date.now(), completions: [], achievements: [] };
    setHabits([...habits, habitToAdd]);
    setNewHabit({ name: '', category: 'General' });
    console.log('Habits:', habits);
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [calendarMode, setCalendarMode] = useState('90day'); // '90day' | 'weekly' | 'monthly'
  const [newlyUnlocked, setNewlyUnlocked] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const filteredHabits = selectedCategory === 'All'
    ? habits
    : habits.filter(habit => habit.category === selectedCategory);

  // Calculate current week days
  const [currentWeekDays, setCurrentWeekDays] = useState([]);

  useEffect(() => {
    if (calendarMode === 'weekly') {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      setCurrentWeekDays(eachDayOfInterval({ start, end }));
    } else if (calendarMode === 'monthly') {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
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
  }, [calendarMode, currentDate]);

  // Toggle calendar mode handler
  const toggleCalendarMode = () => {
    setCalendarMode(prev => {
      if (prev === '90day') return 'weekly';
      if (prev === 'weekly') return 'monthly';
      return '90day';
    });
  };

  const goToPrevWeek = () => setCurrentDate(prev => subWeeks(prev, 1));
  const goToNextWeek = () => setCurrentDate(prev => addWeeks(prev, 1));
  const goToPrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));

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
        const { achievements: newAchievements, newUnlocked } = checkAndAwardAchievements(updatedHabit);
        updatedHabit.achievements = newAchievements;
        if (newUnlocked.length > 0) setNewlyUnlocked(prev => [...prev, ...newUnlocked]);
        return updatedHabit;
      });
    });
  };

  // UI handler to toggle completion on click
  const handleCompletionClick = (habitId, day) => {
    toggleCompletion(habitId, day);
  };

  const weeklySwipeHandlers = useSwipeable({
    onSwipedLeft: goToNextWeek,
    onSwipedRight: goToPrevWeek,
  });

  const monthlySwipeHandlers = useSwipeable({
    onSwipedLeft: goToNextMonth,
    onSwipedRight: goToPrevMonth,
  });

  return (
    <div className="App">
      <header className="App-header">
        {/* Habit input and category select */}
        <input
          type="text"
          placeholder="Habit name"
          value={newHabit.name}
          onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
          className="mb-2 p-2 border border-gray-300 rounded-md w-full max-w-sm"
        />
        <select
          value={newHabit.category}
          onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
          className="mb-2 p-2 border border-gray-300 rounded-md w-full max-w-sm"
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <button
          onClick={addHabit}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Habit
        </button>

        {/* Achievements display */}
        <div className="mb-4 w-full max-w-sm text-left">
          <h4 className="font-semibold mb-2">Achievements:</h4>
          {habits.map(habit => (
            <div key={habit.id} className="mb-2 border p-2 rounded bg-gray-50">
              <div className="font-bold">{habit.name}</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {habit.achievements.length === 0 ? (
                  <span className="text-gray-500 italic">No achievements yet</span>
                ) : (
                  habit.achievements.map(aid => {
                    const ach = achievements.find(a => a.id === aid);
                    return (
                      <span
                        key={aid}
                        className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-semibold"
                        title={ach ? ach.name : aid}
                      >
                        {ach ? ach.name : aid}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? 'All' : cat)}
              className={`px-3 py-1 rounded-full border ${
                selectedCategory === cat ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'
              } focus:outline-none`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Calendar mode toggle */}
        <div className="mb-4">
          <button
            onClick={toggleCalendarMode}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Toggle to {calendarMode === '90day' ? 'Weekly' : calendarMode === 'weekly' ? 'Monthly' : '90-day'} View
          </button>
        </div>

        {calendarMode !== '90day' && (
          <div className="mb-4 flex gap-2">
            <button onClick={calendarMode === 'weekly' ? goToPrevWeek : goToPrevMonth} className="px-4 py-2 bg-gray-600 text-white rounded">Prev</button>
            <button onClick={calendarMode === 'weekly' ? goToNextWeek : goToNextMonth} className="px-4 py-2 bg-gray-600 text-white rounded">Next</button>
          </div>
        )}

        {/* Display current habits */}
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <h3>Current Habits:</h3>
          {filteredHabits.length === 0 ? (
            <p>No habits in this category</p>
          ) : (
            <>
              {calendarMode === 'weekly' ? (
                <div className="overflow-x-auto" {...weeklySwipeHandlers}>
                    <div className="grid grid-cols-7 gap-2 text-center font-semibold mb-2 min-w-max">
                      {currentWeekDays.map(day => (
                        <div key={day ? day.toISOString() : 'empty-' + Math.random()}>{day ? format(day, 'EEE') : ''}</div>
                      ))}
                    </div>
                    {filteredHabits.map(habit => (
                      <div key={habit.id} className="mb-4 min-w-max">
                        <div className="font-bold">{habit.name}</div>
                        <div className="grid grid-cols-7 gap-2 text-center min-w-max">
                          {currentWeekDays.map(day => {
                            if (!day) return <div key={'empty-' + Math.random()} className="min-h-11 min-w-11 rounded bg-gray-100 pointer-events-none p-1" />;
                            const done = isCompletedOn(habit, day);
                            const today = isToday(day);
                            return (
                              <div
                                key={day.toISOString()}
                                className={`min-h-11 min-w-11 rounded cursor-pointer p-1 ${
                                  done ? 'bg-green-500' : today ? 'bg-blue-500' : 'bg-gray-200'
                                }`}
                                title={format(day, 'yyyy-MM-dd')}
                                onClick={() => handleCompletionClick(habit.id, day)}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
              ) : calendarMode === 'monthly' ? (
                <div className="overflow-x-auto" {...monthlySwipeHandlers}>
                  <div className="grid grid-cols-7 gap-2 text-center font-semibold mb-2 min-w-max">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day}>{day}</div>
                    ))}
                  </div>
                  {filteredHabits.map(habit => (
                    <div key={habit.id} className="mb-4 min-w-max">
                      <div className="font-bold">{habit.name}</div>
                      <div className="grid grid-cols-7 gap-2 text-center min-w-max">
                        {currentWeekDays.map((day, idx) => {
                          if (day === null) {
                            return <div key={idx} className="min-h-11 min-w-11 rounded bg-gray-100 pointer-events-none p-1" />;
                          }
                          const done = isCompletedOn(habit, day);
                          const today = isToday(day);
                          return (
                            <div
                              key={idx}
                              className={`min-h-11 min-w-11 rounded cursor-pointer p-1 ${
                                done ? 'bg-green-500' : today ? 'bg-blue-500' : 'bg-gray-200'
                              }`}
                              title={format(day, 'yyyy-MM-dd')}
                              onClick={() => handleCompletionClick(habit.id, day)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="habit-list overflow-y-auto">
                  {filteredHabits.map((habit) => (
                    <div key={habit.id} className="habit-card p-3 sm:p-4 border rounded mb-4 w-full">
                      <div className="font-bold text-sm sm:text-base">{habit.name} - {habit.category}</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {habit.achievements.slice(0,3).map(aid => {
                          const ach = achievements.find(a => a.id === aid);
                          const Icon = ach.icon === 'Award' ? Award : ach.icon === 'Star' ? Star : Medal;
                          const bgColor = ach.icon === 'Award' ? 'bg-yellow-500' : ach.icon === 'Star' ? 'bg-blue-500' : 'bg-green-500';
                          const isNew = newlyUnlocked.includes(aid);
                          return (
                            <motion.div
                              key={aid}
                              initial={isNew ? { scale: 0 } : { scale: 1 }}
                              animate={{ scale: 1 }}
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.5 }}
                              className={`badge ${bgColor} text-white inline-flex items-center gap-1 px-3 py-2 sm:px-2 sm:py-1 rounded cursor-pointer`}
                              title={`${ach.name} - ${ach.condition}`}
                            >
                              <Icon size={16} />
                            </motion.div>
                          );
                        })}
                      </div>
                      <div className="mt-2">
                        <div className="text-sm">Streak: {calculateStreak(habit)}</div>
                        <div className="w-full bg-gray-200 rounded-full h-6">
                          <div className="bg-blue-600 h-6 rounded-full" style={{ width: `${Math.min(calculateStreak(habit) / 30 * 100, 100)}%` }}></div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <TrendingUp size={16} />
                          <span className="text-sm">Avg: {averageCompletion(habit).toFixed(1)} days/week</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => { setSelectedHabit(habit); setModalOpen(true); }} className="px-3 py-2 sm:px-2 sm:py-1 bg-gray-500 text-white rounded">View All Achievements</button>
                        <button onClick={() => deleteHabit(habit.id)} className="px-3 py-2 sm:px-2 sm:py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      {modalOpen && selectedHabit && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-md w-full shadow-2xl transform transition-transform duration-300 ease-in-out hover:scale-105"
            onClick={e => e.stopPropagation()}
          >
            <h3 id="modal-title" className="text-xl font-bold mb-4 text-gray-900">Achievements for {selectedHabit.name}</h3>
            <ul className="space-y-3 max-h-96 overflow-y-auto">
              {achievements.map(ach => {
                const unlocked = selectedHabit.achievements.includes(ach.id);
                const Icon = ach.icon === 'Award' ? Award : ach.icon === 'Star' ? Star : Medal;
                return (
                  <li key={ach.id} className="flex items-center gap-3 text-gray-800 hover:text-indigo-600 transition-colors cursor-default">
                    {unlocked ? <span className="text-green-500">✅</span> : <span className="text-gray-400">❌</span>}
                    <Icon size={20} />
                    <span className={unlocked ? 'font-semibold' : ''}>{ach.name} - {ach.condition}</span>
                  </li>
                );
              })}
            </ul>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-6 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;