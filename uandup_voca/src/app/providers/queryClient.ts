import { QueryClient, MutationCache, QueryCache } from '@tanstack/react-query';
import axios from 'axios';
import { apiErrorBus } from '@/shared/api/apiErrorBus';

// axios 에러에서 표시할 메시지를 추출한다.
// 서버가 { message } 를 내려주면 그 값을 사용하고,
// 없으면 500번대 에러에 한해 일반 fallback 메시지를 반환한다.
function extractErrorMessage(error: unknown): string | null {
  if (!axios.isAxiosError(error)) return null;
  const message: unknown = error.response?.data?.message;
  if (typeof message === 'string' && message.trim()) return message;
  if ((error.response?.status ?? 0) >= 500) return 'A server error occurred. Please try again.';
  return null;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: true,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
  // query / mutation 에러를 중앙에서 처리한다.
  // 서버 메시지가 있으면 그대로, 없으면 500번대에 한해 fallback 메시지를 표시한다.
  // QueryProvider가 구독해 AlertDialog로 표시한다.
  queryCache: new QueryCache({
    onError: (error) => {
      const msg = extractErrorMessage(error);
      if (msg) apiErrorBus.emit(msg);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      const msg = extractErrorMessage(error);
      if (msg) apiErrorBus.emit(msg);
    },
  }),
});
