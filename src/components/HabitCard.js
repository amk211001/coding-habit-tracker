import { motion } from 'framer-motion';
import { Award, Star, Medal, TrendingUp } from 'lucide-react';
import { achievements } from '../constants';

// 1. IMPORT HELPERS
import HabitPieChart from './HabitPiChart'; // Corrected filename typo from HabitPiChart
import { getPieChartData } from '../utils/chartHelper';
import AnimatedCounter from './AnimatedCounter'; // Import the new animated counter

function HabitCard({ habit, calculateStreak, averageCompletion, onViewAchievements, onDelete }) {
  const streak = calculateStreak(habit);
  const avg = averageCompletion(habit);
  const pieData = getPieChartData(habit);

  // 2. CALCULATE THE TOTAL COMPLETIONS FOR THIS HABIT
  const habitCompletionCount = habit.datesCompleted ? habit.datesCompleted.length : 0;

  return (
    <div className="habit-card p-3 sm:p-4 border rounded mb-4 w-full bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="font-bold text-sm sm:text-base">{habit.name} - {habit.category}</div>
      
      {/* --- Achievements Section --- */}
      <div className="flex flex-wrap gap-2 mt-2">
        {habit.achievements.slice(0, 3).map(aid => {
          const ach = achievements.find(a => a.id === aid);
          // Handle case where achievement might not be found
          if (!ach) return null;
          const Icon = ach.icon === 'Award' ? Award : ach.icon === 'Star' ? Star : Medal;
          const bgColor = ach.icon === 'Award' ? 'bg-yellow-500' : ach.icon === 'Star' ? 'bg-blue-500' : 'bg-green-500';
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

      {/* --- Stats Section --- */}
      <div className="mt-2">
        <div className="text-sm">Streak: {streak}</div>
        <div className="w-full bg-gray-200 rounded-full h-6 dark:bg-gray-700">
          <div className="bg-blue-600 h-6 rounded-full" style={{ width: `${Math.min(streak / 30 * 100, 100)}%` }}></div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <TrendingUp size={16} />
          <span className="text-sm">Avg: {avg.toFixed(1)} days/week</span>
        </div>
      </div>
      
      {/* --- Pie Chart Section --- */}
      <div className="mt-4">
        <h4 className="text-center text-sm font-medium text-gray-600 dark:text-gray-400">
          Last 30 Days
        </h4>
        <HabitPieChart data={pieData} />
      </div>

      {/* 3. RENDER THE PER-HABIT ANIMATED COUNTER */}
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        <strong>Total Days Tracked:</strong> <AnimatedCounter value={habitCompletionCount} />
      </div>

      {/* --- Buttons Section --- */}
      <div className="flex gap-2 mt-4">
        <button onClick={() => onViewAchievements(habit)} className="px-3 py-2 sm:px-2 sm:py-1 bg-gray-500 text-white rounded">View All Achievements</button>
        <button onClick={() => onDelete(habit.id)} className="px-3 py-2 sm:px-2 sm:py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
      </div>
    </div>
  );
}

export default HabitCard;