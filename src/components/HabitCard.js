import { motion } from 'framer-motion';
import { Award, Star, Medal, TrendingUp } from 'lucide-react';
import { achievements } from '../constants';

function HabitCard({ habit, calculateStreak, averageCompletion, onViewAchievements, onDelete }) {
  const streak = calculateStreak(habit);
  const avg = averageCompletion(habit);

  return (
    <div className="habit-card p-3 sm:p-4 border rounded mb-4 w-full">
      <div className="font-bold text-sm sm:text-base">{habit.name} - {habit.category}</div>
      <div className="flex flex-wrap gap-2 mt-2">
        {habit.achievements.slice(0, 3).map(aid => {
          const ach = achievements.find(a => a.id === aid);
          const Icon = ach.icon === 'Award' ? Award : ach.icon === 'Star' ? Star : Medal;
          const bgColor = ach.icon === 'Award' ? 'bg-yellow-500' : ach.icon === 'Star' ? 'bg-blue-500' : 'bg-green-500';
          // No 'isNew' animation since newlyUnlocked is not used
          return (
            <motion.div
              key={aid}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className={`badge ${bgColor} text-white inline-flex items-center gap-1 px-3 py-2 sm:px-2 sm:py-1 rounded cursor-pointer`}
              title={`${ach.name} - ${ach.condition}`}
            >
              <Icon size={16} />
            </motion.div>
          );
        })}
      </div>
      <div className="mt-2">
        <div className="text-sm">Streak: {streak}</div>
        <div className="w-full bg-gray-200 rounded-full h-6">
          <div className="bg-blue-600 h-6 rounded-full" style={{ width: `${Math.min(streak / 30 * 100, 100)}%` }}></div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <TrendingUp size={16} />
          <span className="text-sm">Avg: {avg.toFixed(1)} days/week</span>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <button onClick={() => onViewAchievements(habit)} className="px-3 py-2 sm:px-2 sm:py-1 bg-gray-500 text-white rounded">View All Achievements</button>
        <button onClick={() => onDelete(habit.id)} className="px-3 py-2 sm:px-2 sm:py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
      </div>
    </div>
  );
}

export default HabitCard;
