import { useState } from 'react';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { TeacherSideNavBar } from '@/widgets/teacher-nav';
import { requireTeacher } from '@/entities/auth';

export const Route = createFileRoute('/teacher')({
  // TEACHER만 허용 — STUDENT/PARENT는 /student/dashboard로 리다이렉트.
  beforeLoad: requireTeacher,
  component: function TeacherLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
      <div className="bg-surface font-body text-on-surface min-h-dvh">
        <TeacherSideNavBar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <div className={`p-10 transition-all duration-200 ${collapsed ? 'ml-18' : 'ml-64'}`}>
          <Outlet />
        </div>
      </div>
    );
  },
});
