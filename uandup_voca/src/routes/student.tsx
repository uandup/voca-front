import { createFileRoute, Outlet } from '@tanstack/react-router';
import { StudentSideNavBar } from '@/widgets/student-nav/StudentSideNavBar';
import { requireAuth } from '@/entities/auth';

export const Route = createFileRoute('/student')({
  beforeLoad: requireAuth,
  component: () => (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      <StudentSideNavBar />
      <div className="ml-64 p-10">
        <Outlet />
      </div>
    </div>
  ),
});
