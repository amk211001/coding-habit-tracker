import './App.css';
import { useState } from 'react';

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