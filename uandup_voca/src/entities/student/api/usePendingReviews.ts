import { useQuery } from '@tanstack/react-query';
import { getPendingReviews } from './studentApi';
import { toPendingReviewItem } from '../model/mapper';
import { studentKeys } from './queryKeys';

// 학생의 풀어야 할 리뷰 시험 단어 목록 — /api/v1/students/{id}/pending-reviews
export function usePendingReviews(studentId: number) {
  return useQuery({
    queryKey: studentKeys.pendingReviews(studentId),
    queryFn: () => getPendingReviews(studentId),
    select: (res) => (res.data?.reviews ?? []).map(toPendingReviewItem),
    enabled: studentId > 0,
  });
}
