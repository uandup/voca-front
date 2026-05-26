import { useQuery } from '@tanstack/react-query';
import { getReviewDeckCount } from './reviewDeckApi';
import { reviewDeckKeys } from './queryKeys';

export function useReviewDeckCount(studentId: number) {
  return useQuery({
    queryKey: reviewDeckKeys.count(studentId),
    queryFn: () => getReviewDeckCount(studentId),
    select: (res) => res.data ?? 0,
    enabled: studentId > 0,
  });
}
