import { useState } from 'react';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { StudentSideNavBar } from '@/widgets/student-nav/StudentSideNavBar';
import { requireStudentArea } from '@/entities/auth';

export const Route = createFileRoute('/student')({
  // STUDENT(본인) 또는 PARENT(자녀 열람)만 허용 — TEACHER는 /teacher/students로 리다이렉트.
  beforeLoad: requireStudentArea,
  component: function StudentLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
      <div className="bg-surface font-body text-on-surface min-h-screen">
        <StudentSideNavBar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <div className={`p-10 transition-all duration-200 ${collapsed ? 'ml-18' : 'ml-64'}`}>
          <Outlet />
        </div>
      </div>
    );
  },
});
