import { useQuery } from '@tanstack/react-query';
import { getReviewDeckExamList, reviewDeckKeys, toReviewDeckExamRow } from '@/entities/review-deck';

export function useReviewDeckExamList(studentId: number) {
  return useQuery({
    queryKey: reviewDeckKeys.exams(studentId),
    queryFn: () => getReviewDeckExamList(studentId),
    select: (res) => (res.data ?? []).map(toReviewDeckExamRow),
    enabled: studentId > 0,
  });
}
