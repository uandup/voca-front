import { useQuery } from '@tanstack/react-query';
import { getReviewDeckExamList } from './reviewDeckApi';
import { toReviewDeckExamRow } from '../model/mapper';
import { reviewDeckKeys } from './queryKeys';

export function useReviewDeckExamList(studentId: number) {
  return useQuery({
    queryKey: reviewDeckKeys.exams(studentId),
    queryFn: () => getReviewDeckExamList(studentId),
    select: (res) => (res.data ?? []).map(toReviewDeckExamRow),
    enabled: studentId > 0,
  });
}
