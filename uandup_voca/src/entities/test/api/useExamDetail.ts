import { useQuery } from '@tanstack/react-query';
import { getExamDetail } from './testApi';
import { toExamDetail } from '../model/mapper';
import { testKeys } from './queryKeys';

export function useExamDetail(examId: number | null) {
  return useQuery({
    queryKey: testKeys.examDetail(examId ?? -1),
    queryFn: () => getExamDetail(examId!),
    select: (res) => toExamDetail(res.data!),
    enabled: examId !== null,
  });
}
