import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#4CAF50', '#F44336']; // Green for Completed, Red for Missed

const HabitPieChart = ({ data }) => {
  const totalValue = data.reduce((sum, entry) => sum + entry.value, 0);

  // If no completions in 30 days, just show the full "Missed" circle
  if (totalValue === 0 || (data[0].value === 0 && data[1].value === 30)) {
     // You can customize this message or still show the 100% missed chart
  }

  return (
    <div style={{ width: '100%', height: 120 }}> {/* Adjusted height for a more compact card */}
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={50} // Made radius slightly smaller
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HabitPieChart;