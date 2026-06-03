import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import { useLayoutEffect } from 'react';
import { QueryProvider } from '@/app/providers/QueryProvider';

export const Route = createRootRoute({
  component: function RootLayout() {
    const { pathname } = useLocation();

    // SPA 특성상 라우트 이동 시 window 스크롤이 자동으로 초기화되지 않으므로
    // pathname 변경 시 최상단으로 리셋한다.
    useLayoutEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname]);

    return (
      <QueryProvider>
        <Outlet />
      </QueryProvider>
    );
  },
});
