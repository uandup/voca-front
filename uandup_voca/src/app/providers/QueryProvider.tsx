import { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { queryClient } from './queryClient';
import { AlertDialog } from '@/shared/ui/Modal';
import { apiErrorBus } from '@/shared/api/apiErrorBus';

interface Props {
  children: ReactNode;
}

export function QueryProvider({ children }: Props) {
  // mutation 에러 메시지 — apiErrorBus를 통해 MutationCache.onError에서 전달된다.
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // 마운트 시 구독, 언마운트 시 자동 해제.
    return apiErrorBus.subscribe(setErrorMessage);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* 모든 mutation 에러를 중앙에서 처리 — 서버 메시지를 그대로 표시한다. */}
      {errorMessage && (
        <AlertDialog
          variant="error"
          title="Request Failed"
          description={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
    </QueryClientProvider>
  );
}
