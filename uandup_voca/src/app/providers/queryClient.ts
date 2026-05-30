import { QueryClient, MutationCache } from '@tanstack/react-query';
import axios from 'axios';
import { apiErrorBus } from '@/shared/api/apiErrorBus';

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
  // 모든 mutation 에러를 중앙에서 처리한다.
  // 서버가 { status, message } 형태로 내려주는 사용자 친화적 메시지가 있으면 발행.
  // QueryProvider가 구독해 AlertDialog로 표시한다.
  mutationCache: new MutationCache({
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message: unknown = error.response?.data?.message;
        if (typeof message === 'string' && message.trim()) {
          apiErrorBus.emit(message);
        }
      }
    },
  }),
});
