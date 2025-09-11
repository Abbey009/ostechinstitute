'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from 'recharts';

type Course = {
  id: string;
  title: string;
};

type ProgressBarChartProps = {
  courses: Course[];
  progressMap: { [courseId: string]: number };
};

const colors = ['#4ade80', '#60a5fa', '#fbbf24', '#f87171', '#a78bfa', '#34d399'];

const ProgressBarChart = ({ courses, progressMap }: ProgressBarChartProps) => {
  const chartData = courses.map((course, index) => ({
    name: course.title.length > 15 ? course.title.slice(0, 15) + '...' : course.title,
    progress: progressMap[course.id] || 0,
    color: colors[index % colors.length],
  }));

  if (courses.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 text-center sm:text-left">
        Progress Overview
      </h2>
      <div className="h-[300px] sm:h-[400px] bg-white p-4 sm:p-6 rounded-2xl shadow-md overflow-x-auto">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="progress" position="top" formatter={(val: number) => `${val}%`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressBarChart;
