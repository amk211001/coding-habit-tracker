import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

const initialHabits = [
  { id: 1, name: 'Code daily', category: 'General' },
  { id: 2, name: 'Read tech articles', category: 'General' },
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
    const habitToAdd = { ...newHabit, id: Date.now() };
    setHabits([...habits, habitToAdd]);
    setNewHabit({ name: '', category: 'General' });
    console.log('Habits:', habits);
  };

  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredHabits = selectedCategory === 'All'
    ? habits
    : habits.filter(habit => habit.category === selectedCategory);

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> */}

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

        {/* Display current habits */}
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <h3>Current Habits:</h3>
          {filteredHabits.length === 0 ? (
            <p>No habits in this category</p>
          ) : (
            <ul>
              {filteredHabits.map((habit) => (
                <li key={habit.id}>
                  {habit.name} - Category: {habit.category}
                </li>
              ))}
            </ul>
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
