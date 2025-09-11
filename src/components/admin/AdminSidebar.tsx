// src/components/admin/AdminSidebar.tsx
import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-100 p-4">
      <nav className="flex flex-col gap-4">
        <Link href="/admin/dashboard">Dashboard</Link>
        <Link href="/admin/manage-courses">Manage Courses</Link>
        <Link href="/admin/manage-lessons">Manage Lessons</Link>
        <Link href="/admin/add-course">Add Course</Link>
      </nav>
    </aside>
  );
}
