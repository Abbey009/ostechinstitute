import React from "react";

type DashboardStatsProps = {
  totalCourses: number;
  totalLessonsCompleted: number;
  completionRate: string;
};

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalCourses,
  totalLessonsCompleted,
  completionRate,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
      {/* Total Enrolled */}
      <div className="bg-white shadow-md rounded-2xl p-6 text-center">
        <p className="text-sm text-gray-500 mb-1">Total Enrolled</p>
        <p className="text-3xl font-bold text-blue-600">{totalCourses}</p>
      </div>

      {/* Lessons Completed */}
      <div className="bg-white shadow-md rounded-2xl p-6 text-center">
        <p className="text-sm text-gray-500 mb-1">Lessons Completed</p>
        <p className="text-3xl font-bold text-green-600">{totalLessonsCompleted}</p>
      </div>

      {/* Completion Rate */}
      <div className="bg-white shadow-md rounded-2xl p-6 text-center">
        <p className="text-sm text-gray-500 mb-1">Completion Rate</p>
        <p className="text-3xl font-bold text-indigo-600">{completionRate}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
