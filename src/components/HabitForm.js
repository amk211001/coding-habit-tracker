import { useState } from 'react';
import PropTypes from 'prop-types';
import { categories } from '../constants';

function HabitForm({ onAddHabit }) {
  const [newHabit, setNewHabit] = useState({ name: '', category: 'General' });

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
      <input
        type="text"
        placeholder="Habit name"
        value={newHabit.name}
        onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
        className="mb-2 p-2 border border-gray-300 rounded-md w-full max-w-sm"
        required
      />
      <select
        value={newHabit.category}
        onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
        className="mb-2 p-2 border border-gray-300 rounded-md w-full max-w-sm"
      >
        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
      <button
        type="submit"
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Add Habit
      </button>
    </form>
  );
}


HabitForm.propTypes = {
  onAddHabit: PropTypes.func.isRequired,
};

export default HabitForm;
