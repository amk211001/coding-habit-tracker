import { categories } from '../constants';

function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {['All', ...categories].map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(selectedCategory === cat ? 'All' : cat)}
          className={`px-3 py-1 rounded-full border ${
            selectedCategory === cat ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'
          } focus:outline-none`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
