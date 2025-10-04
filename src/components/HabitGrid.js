import { useEffect, useState } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, addWeeks, subMonths, addMonths, isToday, eachDayOfInterval } from 'date-fns';
import { useSwipeable } from 'react-swipeable';

function HabitGrid({ habits, calendarMode, currentDate, onDateChange, onToggleCompletion, isCompletedOn }) {
  const [currentWeekDays, setCurrentWeekDays] = useState([]);

  useEffect(() => {
    if (calendarMode === 'weekly') {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      setCurrentWeekDays(eachDayOfInterval({ start, end }));
    } else if (calendarMode === 'monthly') {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const daysInMonth = eachDayOfInterval({ start, end });

      const startPadding = start.getDay();
      const endPadding = 6 - end.getDay();

      const paddedDays = [
        ...Array(startPadding).fill(null),
        ...daysInMonth,
        ...Array(endPadding).fill(null),
      ];

      setCurrentWeekDays(paddedDays);
    }
  }, [calendarMode, currentDate]);

  const goToPrev = () => {
    if (calendarMode === 'weekly') {
      onDateChange(subWeeks(currentDate, 1));
    } else {
      onDateChange(subMonths(currentDate, 1));
    }
  };

  const goToNext = () => {
    if (calendarMode === 'weekly') {
      onDateChange(addWeeks(currentDate, 1));
    } else {
      onDateChange(addMonths(currentDate, 1));
    }
  };

  const weeklySwipeHandlers = useSwipeable({
    onSwipedLeft: goToNext,
    onSwipedRight: goToPrev,
  });

  const monthlySwipeHandlers = useSwipeable({
    onSwipedLeft: goToNext,
    onSwipedRight: goToPrev,
  });

  const swipeHandlers = calendarMode === 'weekly' ? weeklySwipeHandlers : monthlySwipeHandlers;

  if (calendarMode === 'weekly') {
    return (
      <div className="overflow-x-auto" {...swipeHandlers}>
        <div className="grid grid-cols-7 gap-2 text-center font-semibold mb-2 min-w-max">
          {currentWeekDays.map(day => (
            <div key={day ? day.toISOString() : 'empty-' + Math.random()}>{day ? format(day, 'EEE') : ''}</div>
          ))}
        </div>
        {habits.map(habit => (
          <div key={habit.id} className="mb-4 min-w-max">
            <div className="font-bold">{habit.name}</div>
            <div className="grid grid-cols-7 gap-2 text-center min-w-max">
              {currentWeekDays.map(day => {
                if (!day) return <div key={'empty-' + Math.random()} className="min-h-11 min-w-11 rounded bg-gray-100 pointer-events-none p-1" />;
                const done = isCompletedOn(habit, day);
                const today = isToday(day);
                return (
                  <div
                    key={day.toISOString()}
                    className={`min-h-11 min-w-11 rounded cursor-pointer p-1 ${
                      done ? 'bg-green-500' : today ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                    title={format(day, 'yyyy-MM-dd')}
                    onClick={() => onToggleCompletion(habit.id, day)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (calendarMode === 'monthly') {
    return (
      <div className="overflow-x-auto" {...swipeHandlers}>
        <div className="grid grid-cols-7 gap-2 text-center font-semibold mb-2 min-w-max">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>
        {habits.map(habit => (
          <div key={habit.id} className="mb-4 min-w-max">
            <div className="font-bold">{habit.name}</div>
            <div className="grid grid-cols-7 gap-2 text-center min-w-max">
              {currentWeekDays.map((day, idx) => {
                if (day === null) {
                  return <div key={idx} className="min-h-11 min-w-11 rounded bg-gray-100 pointer-events-none p-1" />;
                }
                const done = isCompletedOn(habit, day);
                const today = isToday(day);
                return (
                  <div
                    key={idx}
                    className={`min-h-11 min-w-11 rounded cursor-pointer p-1 ${
                      done ? 'bg-green-500' : today ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                    title={format(day, 'yyyy-MM-dd')}
                    onClick={() => onToggleCompletion(habit.id, day)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default HabitGrid;
