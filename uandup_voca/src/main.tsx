import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from '@/app/routeTree.gen';
import { initInstallPromptCapture } from '@/shared/lib/useInstallPrompt';
import './index.css';

// 크롬은 페이지 로드 직후 beforeinstallprompt를 한 번 쏘고 만다.
// 설치 버튼이 있는 /m/account는 lazy 로딩이라 그때 등록하면 이벤트를 놓치므로 여기서 먼저 건다.
initInstallPromptCapture();

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
