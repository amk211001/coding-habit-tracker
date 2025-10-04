import './App.css';
import { useState, useCallback } from 'react';
import { subWeeks, addWeeks, subMonths, addMonths } from 'date-fns';
import { useHabits } from './hooks/useHabits';
import { achievements } from './constants';
import { initialHabits } from './constants';
import HabitForm from './components/HabitForm';
import CategoryFilter from './components/CategoryFilter';
import CalendarToggle from './components/CalendarToggle';
import HabitGrid from './components/HabitGrid';
import HabitCard from './components/HabitCard';
import AchievementModal from './components/AchievementModal';

function App() {
  const {
    habits,
    calculateStreak,
    averageCompletion,
    isCompletedOn,
    toggleCompletion,
    addHabit,
    deleteHabit,
  } = useHabits(initialHabits);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [calendarMode, setCalendarMode] = useState('90day');
  const [newlyUnlocked, setNewlyUnlocked] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const filteredHabits = selectedCategory === 'All'
    ? habits
    : habits.filter(habit => habit.category === selectedCategory);

  const toggleCalendarMode = useCallback(() => {
    setCalendarMode(prev => {
      if (prev === '90day') return 'weekly';
      if (prev === 'weekly') return 'monthly';
      return '90day';
    });
  }, []);

  const handleToggleCompletion = useCallback((habitId, day) => {
    toggleCompletion(habitId, day);
    // Note: Handling newly unlocked achievements would need to be adjusted
  }, [toggleCompletion]);

  const handleViewAchievements = useCallback((habit) => {
    setSelectedHabit(habit);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedHabit(null);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <HabitForm onAddHabit={addHabit} />

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

        <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        <CalendarToggle calendarMode={calendarMode} onToggle={toggleCalendarMode} />

        {calendarMode !== '90day' && (
          <div className="mb-4 flex gap-2">
            <button onClick={() => setCurrentDate(prev => calendarMode === 'weekly' ? subWeeks(prev, 1) : subMonths(prev, 1))} className="px-4 py-2 bg-gray-600 text-white rounded">Prev</button>
            <button onClick={() => setCurrentDate(prev => calendarMode === 'weekly' ? addWeeks(prev, 1) : addMonths(prev, 1))} className="px-4 py-2 bg-gray-600 text-white rounded">Next</button>
          </div>
        )}

        {/* Display current habits */}
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <h3>Current Habits:</h3>
          {filteredHabits.length === 0 ? (
            <p>No habits in this category</p>
          ) : calendarMode === '90day' ? (
            <div className="habit-list overflow-y-auto">
              {filteredHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  calculateStreak={calculateStreak}
                  averageCompletion={averageCompletion}
                  onViewAchievements={handleViewAchievements}
                  onDelete={deleteHabit}
                  newlyUnlocked={newlyUnlocked}
                />
              ))}
            </div>
          ) : (
            <HabitGrid
              habits={filteredHabits}
              calendarMode={calendarMode}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onToggleCompletion={handleToggleCompletion}
              isCompletedOn={isCompletedOn}
            />
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

      <AchievementModal habit={selectedHabit} onClose={handleCloseModal} />
    </div>
  );
}

export default App;