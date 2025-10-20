import "./App.css";
import { useState, useCallback } from "react";
import { useHabits } from "./hooks/useHabits";
import { useReminder } from "./hooks/useReminder";
import { subWeeks, addWeeks, subMonths, addMonths } from "date-fns";
import { initialHabits } from "./constants";

// Import all components
import HabitForm from "./components/HabitForm";
import CategoryFilter from "./components/CategoryFilter";
import CalendarToggle from "./components/CalendarToggle";
import HabitGrid from "./components/HabitGrid";
import HabitCard from "./components/HabitCard";
import AchievementModal from "./components/AchievementModal";
import NotificationSettings from "./components/NotificationSettings/NotificationSettings";
import MotivationalQuote from "./components/MotivationalQuote";

function App() {
  // Custom hooks for managing state
  const {
    habits,
    addHabit,
    deleteHabit,
    toggleCompletion,
    isCompletedOn,
    calculateStreak,
    averageCompletion,
  } = useHabits(initialHabits);

  // All state for this component
  const [accessibility, setAccessibility] = useState({
    largeText: false,
    highContrast: false,
  });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [calendarMode, setCalendarMode] = useState("90day");
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reminderPermission, setReminderPermission] = useState(false);

  // Your accessibility functions
  const toggleLargeText = () => {
    setAccessibility((prev) => ({ ...prev, largeText: !prev.largeText }));
  };

  const toggleHighContrast = () => {
    setAccessibility((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  };

  // Your dynamic class name logic
  const appClasses = [
    "App",
    accessibility.largeText ? "large-text" : "",
    accessibility.highContrast ? "high-contrast" : "",
  ]
    .join(" ")
    .trim();

  // Logic from the other branch
  const showReminder = (habit) => {
    alert(`Reminder: Complete Daily ${habit.name}!`);
  };
  useReminder(habits, showReminder, reminderPermission);

  const filteredHabits =
    selectedCategory === "All"
      ? habits
      : habits.filter((habit) => habit.category === selectedCategory);

  const toggleCalendarMode = useCallback(() => {
    setCalendarMode((prev) => {
      if (prev === "90day") return "weekly";
      if (prev === "weekly") return "monthly";
      return "90day";
    });
  }, []);

  const handleToggleCompletion = useCallback(
    (habitId, day) => {
      toggleCompletion(habitId, day);
    },
    [toggleCompletion]
  );

  const handleViewAchievements = useCallback((habit) => {
    setSelectedHabit(habit);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedHabit(null);
  }, []);

  return (
    <div className={appClasses}>
      {" "}
      {/* Your dynamic class is here */}
      <header className="App-header">
        {/* Your accessibility toggles are here */}
        <div style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}>
          <button onClick={toggleLargeText}>Toggle Large Text</button>
          <button onClick={toggleHighContrast} style={{ marginLeft: "10px" }}>
            Toggle High Contrast
          </button>
        </div>

        {/* All components and features from the other branch */}
        <NotificationSettings
          reminderPermission={reminderPermission}
          setReminderPermission={setReminderPermission}
        />
        <HabitForm onAddHabit={addHabit} />
        <MotivationalQuote />

        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <CalendarToggle
          calendarMode={calendarMode}
          onToggle={toggleCalendarMode}
        />

        {calendarMode !== "90day" && (
          <div className="mb-4 flex gap-2">
            <button
              onClick={() =>
                setCurrentDate((prev) =>
                  calendarMode === "weekly"
                    ? subWeeks(prev, 1)
                    : subMonths(prev, 1)
                )
              }
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Prev
            </button>
            <button
              onClick={() =>
                setCurrentDate((prev) =>
                  calendarMode === "weekly"
                    ? addWeeks(prev, 1)
                    : addMonths(prev, 1)
                )
              }
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Next
            </button>
          </div>
        )}

        <div style={{ marginTop: "20px", textAlign: "left", width: "100%" }}>
          <h3>Current Habits:</h3>
          {filteredHabits.length === 0 ? (
            <p>No habits in this category</p>
          ) : calendarMode === "90day" ? (
            <div className="habit-list overflow-y-auto">
              {filteredHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  calculateStreak={calculateStreak}
                  averageCompletion={averageCompletion}
                  onViewAchievements={handleViewAchievements}
                  onDelete={deleteHabit}
                />
              ))}
            </div>
          ) : (
            <HabitGrid
              habits={filteredHabits}
              calendarMode={calendarMode}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onToggleCompletion={handleToggleCompletion}
              isCompletedOn={isCompletedOn}
            />
          )}
        </div>
      </header>
      <AchievementModal habit={selectedHabit} onClose={handleCloseModal} />
    </div>
  );
}

export default App;