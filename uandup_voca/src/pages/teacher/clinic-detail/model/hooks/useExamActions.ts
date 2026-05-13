import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createExam,
  startOnlineExam,
  cancelExam,
  recordOnlineResults,
  recordOfflineResults,
} from '@/entities/test';
import type { ExamType } from '@/entities/test';
import { studentKeys } from '@/entities/student';

interface UseExamActionsParams {
  studySetId: number;
  studentId: number;
  examType: ExamType;
  currentExamId: number | null;
}

export function useExamActions({
  studySetId,
  studentId,
  examType,
  currentExamId,
}: UseExamActionsParams) {
  const queryClient = useQueryClient();

  const invalidateSets = () =>
    queryClient.invalidateQueries({ queryKey: studentKeys.studySets(studentId) });

  const create = useMutation({
    mutationFn: () => createExam(studySetId, { examType }),
    onSuccess: invalidateSets,
  });

  const startOnline = useMutation({
    mutationFn: () => startOnlineExam(currentExamId!),
    onSuccess: invalidateSets,
  });

  const cancel = useMutation({
    mutationFn: () => cancelExam(currentExamId!),
    onSuccess: invalidateSets,
  });

  const gradeOnline = useMutation({
    mutationFn: (payload: Parameters<typeof recordOnlineResults>[1]) =>
      recordOnlineResults(currentExamId!, payload),
    onSuccess: invalidateSets,
  });

  const gradeOffline = useMutation({
    mutationFn: (payload: Parameters<typeof recordOfflineResults>[1]) =>
      recordOfflineResults(currentExamId!, payload),
    onSuccess: invalidateSets,
  });

  return { create, startOnline, cancel, gradeOnline, gradeOffline };
}
