import { useQuery } from '@tanstack/react-query';
import { getExamsByType, toStepExamHistory, testKeys } from '@/entities/test';
import type { ExamType } from '@/entities/test';

export function useStudySetDetail(studySetId: number, examType: ExamType, enabled: boolean) {
  return useQuery({
    queryKey: testKeys.history(studySetId, examType),
    queryFn: () => getExamsByType(studySetId, examType),
    select: (res) => toStepExamHistory(res.data!),
    enabled,
  });
}
