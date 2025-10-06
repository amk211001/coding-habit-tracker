import { useState, useEffect } from 'react';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';

const initialHabits = [
  { id: 1, name: 'Code daily', category: 'General', completions: [new Date()] },
  { id: 2, name: 'Read tech articles', category: 'General', completions: [] },
];

function App() {
  const [habits, setHabits] = useState(initialHabits);
  const [newHabit, setNewHabit] = useState({ name: '', category: 'General' });
  const [accessibility, setAccessibility] = useState({ largeText: false, highContrast: false });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [calendarMode, setCalendarMode] = useState('90day');
  const [currentWeekDays, setCurrentWeekDays] = useState([]);
  const categories = ['Coding', 'Learning', 'Project', 'Review', 'General'];

  const addHabit = () => {
    if (newHabit.category.trim() === '') {
      console.error('Category cannot be empty');
      return;
    }
    const habitToAdd = { ...newHabit, id: Date.now(), completions: [] };
    setHabits([...habits, habitToAdd]);
    setNewHabit({ name: '', category: 'General' });
    console.log('Habits:', habits);
  };

  const toggleLargeText = () => {
  setAccessibility(prev => ({ ...prev, largeText: !prev.largeText }));
  };

  const toggleHighContrast = () => {
    setAccessibility(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const appClasses = [
    "App",
    accessibility.largeText ? "large-text" : "",
    accessibility.highContrast ? "high-contrast" : ""
  ].join(" ").trim();

  const filteredHabits = selectedCategory === 'All'
    ? habits
    : habits.filter(habit => habit.category === selectedCategory);

  useEffect(() => {
    if (calendarMode === 'weekly') {
      const start = startOfWeek(new Date(), { weekStartsOn: 0 }); // Sunday
      const end = endOfWeek(new Date(), { weekStartsOn: 0 });
      setCurrentWeekDays(eachDayOfInterval({ start, end }));
    }
  }, [calendarMode]);

  const handleViewAchievements = useCallback((habit) => {
    setSelectedHabit(habit);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedHabit(null);
  }, []);

  const handleExportCSV = () => {
    if (habits.length === 0) {
      alert("There are no habits to export.");
      return;
    }

    const headers = ['id', 'name', 'category', 'completions'];

    const rows = habits.map(habit => {
      const { id, name, category, completions } = habit;
      
      const escapedName = `"${name.replace(/"/g, '""')}"`;
      const escapedCategory = `"${category.replace(/"/g, '""')}"`;
      
      const completionsJSON = `"${JSON.stringify(completions).replace(/"/g, '""')}"`;

      return [id, escapedName, escapedCategory, completionsJSON].join(',');
    });

    const csvContent = [
      headers.join(','),
      ...rows
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'habits.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // START: Added JSON Export Logic
  const handleExportJSON = () => {
    if (habits.length === 0) {
      alert("There are no habits to export.");
      return;
    }

    // Convert the habits array to a pretty-printed JSON string
    const jsonContent = JSON.stringify(habits, null, 2);

    // Create a Blob from the JSON string
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });

    // Create a link element to trigger the download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'habits.json');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // END: Added JSON Export Logic

  return (
    <div className={appClasses}>
      <header className="App-header">
        {" "}
        <div style={{ position: "absolute", top: 10, right: 10 }}>
           <button onClick={toggleLargeText}>Toggle Large Text</button>{" "}
          <button onClick={toggleHighContrast} style={{ marginLeft: "10px" }}>
            Toggle High Contrast
          </button>
          {" "}
        </div>
        {/* Input for new habit name */}
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
