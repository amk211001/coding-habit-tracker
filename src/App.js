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

const initialHabits = [
  { id: 1, name: 'Code daily', category: 'General', completions: [new Date()] },
  { id: 2, name: 'Read tech articles', category: 'General', completions: [] },
];

function App() {
  const [habits, setHabits] = useState(initialHabits);
  const [newHabit, setNewHabit] = useState({ name: '', category: 'General' });
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

        {/* Display current habits */}
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <h3>Current Habits:</h3>
          {filteredHabits.length === 0 ? (
            <p>No habits in this category</p>
          ) : (
            <>
              {calendarMode === 'weekly' ? (
                <div>
                  <div className="grid grid-cols-7 gap-2 text-center font-semibold mb-2">
                    {currentWeekDays.map(day => (
                      <div key={day ? day.toISOString() : 'empty-' + Math.random()}>{day ? format(day, 'EEE') : ''}</div>
                    ))}
                  </div>
                  {filteredHabits.map(habit => (
                    <div key={habit.id} className="mb-4">
                      <div className="font-bold">{habit.name}</div>
                      <div className="grid grid-cols-7 gap-2 text-center">
                        {currentWeekDays.map(day => {
                          if (!day) return <div key={'empty-' + Math.random()} className="h-8 w-8 rounded bg-gray-100 pointer-events-none" />;
                          const done = isCompletedOn(habit, day);
                          const today = isToday(day);
                          return (
                            <div
                              key={day.toISOString()}
                              className={`h-8 w-8 rounded ${
                                done ? 'bg-green-500' : today ? 'bg-blue-500' : 'bg-gray-200'
                              }`}
                              title={format(day, 'yyyy-MM-dd')}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : calendarMode === 'monthly' ? (
                <div>
                  <div className="grid grid-cols-7 gap-2 text-center font-semibold mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day}>{day}</div>
                    ))}
                  </div>
                  {filteredHabits.map(habit => (
                    <div key={habit.id} className="mb-4">
                      <div className="font-bold">{habit.name}</div>
                      <div className="grid grid-cols-7 gap-2 text-center">
                        {currentWeekDays.map((day, idx) => {
                          if (day === null) {
                            return <div key={idx} className="h-6 w-6 rounded bg-gray-100 pointer-events-none" />;
                          }
                          const done = isCompletedOn(habit, day);
                          const today = isToday(day);
                          return (
                            <div
                              key={idx}
                              className={`h-6 w-6 rounded ${
                                done ? 'bg-green-500' : today ? 'bg-blue-500' : 'bg-gray-200'
                              }`}
                              title={format(day, 'yyyy-MM-dd')}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ul>
                  {filteredHabits.map((habit) => (
                    <li key={habit.id}>
                      {habit.name} - Category: {habit.category}
                    </li>
                  ))}
                </ul>
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
    </div>
  );
}

export default App;
