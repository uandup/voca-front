import { useQuery } from '@tanstack/react-query';
import { getExamDetail, toExamDetail } from '@/entities/test';

export function useExamDetail(examId: number | null) {
  return useQuery({
    queryKey: ['clinic-detail', 'exam', examId],
    queryFn: () => getExamDetail(examId!),
    select: (res) => toExamDetail(res.data!),
    enabled: examId !== null,
    staleTime: Infinity,
  });
}
