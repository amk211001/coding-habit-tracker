import './App.css';
import { useState } from 'react';

const initialHabits = [
  { id: 1, name: 'Code daily', category: 'General' },
  { id: 2, name: 'Read tech articles', category: 'General' },
];

function App() {
  const [habits, setHabits] = useState(initialHabits);
  const [newHabit, setNewHabit] = useState({ name: '', category: 'General' });
  const [accessibility, setAccessibility] = useState({ largeText: false, highContrast: false });
  const categories = ['Coding', 'Learning', 'Project', 'Review', 'General'];

  const addHabit = () => {
    if (newHabit.category.trim() === '') {
      console.error('Category cannot be empty');
      return;
    }
    const habitToAdd = { ...newHabit, id: Date.now() };
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
        />

        {/* Select for new habit category */}
        <select
          value={newHabit.category}
          onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
          className="w-full max-w-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        {/* Button to add habit */}
        <button onClick={addHabit}>Add Habit</button>

        {/* Display current habits */}
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <h3>Current Habits:</h3>
          <ul>
            {habits.map((habit) => (
              <li key={habit.id}>
                {habit.name} - Category: {habit.category}
              </li>
            ))}
          </ul>
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
