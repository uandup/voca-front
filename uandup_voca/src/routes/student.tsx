import { useState } from 'react';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { StudentSideNavBar } from '@/widgets/student-nav';
import { requireStudentArea } from '@/entities/auth';

// xl 브레이크포인트(1280px) 미만은 사이드바를 강제 collapse로 고정한다.
// iPad Pro 12.9 가로(1366px)는 데스크탑 취급 — iPad Air/Mini 가로(~1180px)까지 커버.
const isTablet = () => window.innerWidth < 1280;

export const Route = createFileRoute('/student')({
  // STUDENT(본인) 또는 PARENT(자녀 열람)만 허용 — TEACHER는 /teacher/students로 리다이렉트.
  beforeLoad: requireStudentArea,
  component: function StudentLayout() {
    const [collapsed, setCollapsed] = useState(() => isTablet());
    const tablet = isTablet();

    return (
      <div className="bg-surface font-body text-on-surface min-h-screen">
        <StudentSideNavBar
          collapsed={tablet ? true : collapsed}
          onToggle={() => setCollapsed((v) => !v)}
          toggleDisabled={tablet}
        />
        <div
          className={`p-10 transition-all duration-200 ${tablet || collapsed ? 'ml-18' : 'ml-64'}`}
        >
          <Outlet />
        </div>
      </div>
    );
  },
});
