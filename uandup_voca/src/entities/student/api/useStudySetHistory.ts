import { useInfiniteQuery } from '@tanstack/react-query';
import { getStudySetHistory } from './studentApi';
import { studentKeys } from './queryKeys';

export function useStudySetHistory(studentId: number) {
  return useInfiniteQuery({
    queryKey: studentKeys.studySetHistory(studentId),
    queryFn: ({ pageParam }: { pageParam: number }) => getStudySetHistory(studentId, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const pageData = lastPage.data;
      return pageData?.hasNext ? (pageData.page ?? 0) + 1 : undefined;
    },
    enabled: studentId > 0,
  });
}
