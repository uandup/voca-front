import { useQuery } from '@tanstack/react-query';
import { getExamsByType, toStepExamHistory } from '@/entities/test';
import type { ExamType } from '@/entities/test';

export function useStudySetDetail(studySetId: number, examType: ExamType, enabled: boolean) {
  return useQuery({
    queryKey: ['clinic-detail', 'exam-history', studySetId, examType],
    queryFn: () => getExamsByType(studySetId, examType),
    select: (res) => toStepExamHistory(res.data!),
    enabled,
    staleTime: Infinity,
  });
}
