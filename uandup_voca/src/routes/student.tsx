import { useState } from 'react';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { StudentSideNavBar } from '@/widgets/student-nav/StudentSideNavBar';
import { requireAuth } from '@/entities/auth';

export const Route = createFileRoute('/student')({
  beforeLoad: requireAuth,
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
