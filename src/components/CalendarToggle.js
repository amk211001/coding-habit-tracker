function CalendarToggle({ calendarMode, onToggle }) {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Toggle to {calendarMode === '90day' ? 'Weekly' : calendarMode === 'weekly' ? 'Monthly' : '90-day'} View
      </button>
    </div>
  );
}

export default CalendarToggle;
