import { Award, Star, Medal } from 'lucide-react';
import { achievements } from '../constants';

function AchievementModal({ habit, onClose }) {
  if (!habit) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg max-w-md w-full shadow-2xl transform transition-transform duration-300 ease-in-out hover:scale-105"
        onClick={e => e.stopPropagation()}
      >
        <h3 id="modal-title" className="text-xl font-bold mb-4 text-gray-900">Achievements for {habit.name}</h3>
        <ul className="space-y-3 max-h-96 overflow-y-auto">
          {achievements.map(ach => {
            const unlocked = habit.achievements.includes(ach.id);
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
          onClick={onClose}
          className="mt-6 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default AchievementModal;
