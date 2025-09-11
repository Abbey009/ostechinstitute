'use client';
import Head from 'next/head';
import DashboardStats from '@/components/dashboard/DashboardStats';
import ProgressBarChart from '@/components/dashboard/ProgressBarChart';
import CourseCard from '@/components/dashboard/CourseCard';
import EmptyState from '@/components/dashboard/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    courses,
    progressMap,
    lessonStats,
    lastActivityMap,
    loading,
    error,
  } = useDashboardData();

  const totalLessonsCompleted = Object.values(lessonStats).reduce((sum, stats) => sum + stats.completed, 0);
  const completionRate = (() => {
    const total = Object.values(lessonStats).reduce((sum, s) => sum + s.total, 0);
    const completed = Object.values(lessonStats).reduce((sum, s) => sum + s.completed, 0);
    return total > 0 ? `${Math.round((completed / total) * 100)}%` : '0%';
  })();

  if (authLoading || loading) return <LoadingSpinner />;
  if (!user) return <div className="text-center mt-10 text-red-500">You must be logged in to view your dashboard.</div>;

  return (
    <>
      <Head><title>Dashboard</title></Head>
      <div className="p-5 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Your Dashboard</h1>
        {error && <div className="text-red-500 text-sm">{error}</div>}

        <DashboardStats
          totalCourses={courses.length}
          totalLessonsCompleted={totalLessonsCompleted}
          completionRate={completionRate}
        />

        <ProgressBarChart courses={courses} progressMap={progressMap} />

        {courses.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={progressMap[course.id] || 0}
                lesson={lessonStats[course.id] || { total: 0, completed: 0 }}
                lastActivity={lastActivityMap[course.id]}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
