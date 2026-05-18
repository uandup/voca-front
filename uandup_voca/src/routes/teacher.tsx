import { createFileRoute, Outlet } from '@tanstack/react-router';
import { TeacherSideNavBar } from '@/widgets/teacher-nav/TeacherSideNavBar';
import { requireAuth } from '@/entities/auth';

export const Route = createFileRoute('/teacher')({
  beforeLoad: requireAuth,
  component: () => (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      <TeacherSideNavBar />
      <div className="ml-64 p-10">
        <Outlet />
      </div>
    </div>
  ),
});
