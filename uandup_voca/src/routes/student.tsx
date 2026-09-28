import { useState, useEffect } from 'react';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { StudentSideNavBar } from '@/widgets/student-nav';
import { requireStudentArea } from '@/entities/auth';
import { shouldRedirectToMobile } from '@/shared/lib/viewport';

// xl 브레이크포인트(1280px) 미만은 사이드바를 강제 collapse로 고정한다.
// iPad Pro 12.9 가로(1366px)는 데스크탑 취급 — iPad Air/Mini 가로(~1180px)까지 커버.
// matchMedia를 사용해 브레이크포인트를 넘는 순간에만 상태를 업데이트한다 (resize 이벤트 대비 성능 우위).
const DESKTOP_MQ = '(min-width: 1280px)';

export const Route = createFileRoute('/student')({
  // STUDENT(본인) 또는 PARENT(자녀 열람)만 허용 — TEACHER는 /teacher/students로 리다이렉트.
  beforeLoad: () => {
    requireStudentArea();
    // 폰 폭이면 모바일 전용 화면(/m)으로 보낸다. 로그인 직후 경로(OAuthCallback·Pending)도
    // /student를 거치므로 이 한 곳만으로 로그인 흐름까지 커버된다.
    //
    // 리다이렉트는 단방향이다 — /m은 데스크탑 사용자를 여기로 되돌려보내지 않는다.
    // 그래야 무한 루프가 구조적으로 불가능하다. 창을 좁게 쓰다 /m으로 튕긴 데스크탑
    // 사용자는 /m/account의 "Use desktop site"로 빠져나온다(선호도가 저장된다).
    if (shouldRedirectToMobile()) {
      throw redirect({ to: '/m' });
    }
  },
  component: function StudentLayout() {
    const [tablet, setTablet] = useState(() => !window.matchMedia(DESKTOP_MQ).matches);
    const [collapsed, setCollapsed] = useState(() => !window.matchMedia(DESKTOP_MQ).matches);

    useEffect(() => {
      const mq = window.matchMedia(DESKTOP_MQ);
      function handleChange(e: MediaQueryListEvent) {
        const isDesktop = e.matches;
        setTablet(!isDesktop);
        setCollapsed(!isDesktop);
      }
      mq.addEventListener('change', handleChange);
      return () => mq.removeEventListener('change', handleChange);
    }, []);

    return (
      <div className="bg-surface font-body text-on-surface min-h-dvh">
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
