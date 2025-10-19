// This function assumes your `habit` object has an array of completion dates
// e.g., habit.datesCompleted = ['2025-10-13T12:00:00.000Z', '2025-10-14T12:00:00.000Z']
export const getPieChartData = (habit) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const completedCount = (habit.datesCompleted || []).filter(dateStr => {
    const completionDate = new Date(dateStr);
    return completionDate >= thirtyDaysAgo;
  }).length;

  const totalDays = 30;
  const missedCount = totalDays - completedCount;

  return [
    { name: 'Completed', value: completedCount },
    { name: 'Missed', value: missedCount },
  ];
};