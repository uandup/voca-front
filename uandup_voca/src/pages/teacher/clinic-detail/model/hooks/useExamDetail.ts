import { useQuery } from '@tanstack/react-query';
import { getExamDetail, toExamDetail, testKeys } from '@/entities/test';

export function useExamDetail(examId: number | null) {
  return useQuery({
    queryKey: testKeys.examDetail(examId ?? -1),
    queryFn: () => getExamDetail(examId!),
    select: (res) => toExamDetail(res.data!),
    enabled: examId !== null,
  });
}
