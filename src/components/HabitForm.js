import { useState } from 'react';
import { categories } from '../constants';

function HabitForm({ onAddHabit }) {
  // State includes reminderTime for optional daily reminder
  const [newHabit, setNewHabit] = useState({ name: '', category: 'General', reminderTime: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newHabit.name.trim() === '') return;
    try {
      onAddHabit(newHabit);
      setNewHabit({ name: '', category: 'General' });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {/* Habit name input */}
      <input
        type="text"
        placeholder="Habit name"
        value={newHabit.name}
        onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
        className="mb-2 p-2 border border-gray-300 rounded-md w-full max-w-sm"
        required
      />
      {/* Category selection */}
      <select
        value={newHabit.category}
        onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
        className="mb-2 p-2 border border-gray-300 rounded-md w-full max-w-sm"
      >
        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
      {/* Reminder time input (optional) */}
      <input
        type="time"
        value={newHabit.reminderTime}
        onChange={e => setNewHabit({ ...newHabit, reminderTime: e.target.value })}
        className="mb-2 p-2 border border-gray-300 rounded-md w-full max-w-sm"
        placeholder="Reminder time (optional)"
      />
      <button
        type="submit"
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Add Habit
      </button>
    </form>
  );
}

export default HabitForm;
