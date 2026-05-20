import { useState } from 'react';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { TeacherSideNavBar } from '@/widgets/teacher-nav/TeacherSideNavBar';
import { requireAuth } from '@/entities/auth';

export const Route = createFileRoute('/teacher')({
  beforeLoad: requireAuth,
  component: function TeacherLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
      <div className="bg-surface font-body text-on-surface min-h-screen">
        <TeacherSideNavBar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <div className={`p-10 transition-all duration-200 ${collapsed ? 'ml-18' : 'ml-64'}`}>
          <Outlet />
        </div>
      </div>
    );
  },
});
