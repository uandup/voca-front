import { createFileRoute, Outlet } from '@tanstack/react-router';
import { MobileStudentTabBar } from '@/widgets/mobile-nav';
import { requireStudentArea } from '@/entities/auth';

// 폰 전용 학생 화면(단어 조회)의 레이아웃 라우트.
// /student 트리와 완전히 분리해 데스크탑 화면을 건드리지 않는다.
export const Route = createFileRoute('/m')({
  // /student와 동일한 가드를 재사용한다 — STUDENT 본인 또는 PARENT(자녀 열람)만 허용.
  // PARENT 허용이 안전한 이유: /m에는 쓰기 동작이 없고(북마크·셔플·가리기 전부 localStorage)
  // 시험 화면도 없다. useCurrentStudentId가 자녀 id를 자동 해석한다.
  beforeLoad: requireStudentArea,
  component: function MobileLayout() {
    return (
      <div className="bg-surface font-body text-on-surface min-h-dvh overflow-x-hidden">
        {/* 하단 탭바(3.5rem)와 세이프에리어만큼 아래를 비워 마지막 항목이 탭바에 덮이지 않게 한다. */}
        <div className="pb-[calc(3.5rem+var(--safe-bottom)+1rem)]">
          <Outlet />
        </div>
        <MobileStudentTabBar />
      </div>
    );
  },
});
